const Joi = require('joi');
const mongoose = require('mongoose');
const User = require('../../db/models/user');
const Activity = require('../../db/models/activity');

const {
  REACT_APP_cookieKeyName: cookieKeyName
} = process.env;

const errorUtils = require('../../utils/errorUtils');
const jwt = require('../../utils/jwtUtils');
const mailer = require('../../utils/mailer');
const imgCloud = require('../../utils/imgCloud');

const PER_PAGE = 6;

module.exports.logout = (req, res) => {

  res
    .cookie(cookieKeyName, null, {
      maxAge: 0,
      httpOnly: true
    })
    .status(204)
    .send();

};

module.exports.verifyLoginStatus = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .cookie(cookieKeyName, null, {
          maxAge: 0,
          httpOnly: true
        })
        .status(401)
        .send();
    }

    return res.send({
      user: {
        strategy: user.strategy,
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        bookmarked: user.bookmarked
      }
    });

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.verifyPassword = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    password: Joi.string().required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  try {

    const user = await User.findUserById(req.user._id);

    if (!user) {
      return errorUtils.noUser(res);
    }

    const verified = await user.verifyPassword(req.body.password);

    if (!verified) {
      return errorUtils.wrongPwd(res);
    }

    return res.status(204).send();

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.updatePassword = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    newPassword: Joi.string().min(6).max(20).required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  // grabs the user information
  let user = null;

  try {

    user = await User.findUserById(req.user._id);

    if (!user) {
      return errorUtils.noUser(res);
    }

    if (user.checkPrevPwd(req.body.newPassword)) {
      return res.status(403).send({
        message: 'New password must be different from previously used passwords.'
      });
    }

    user.password = req.body.newPassword;

  } catch (error) {
    return errorUtils.server(res, error);
  }

  try {

    const modifiedUser = await user.save();

    if (modifiedUser) {
      return res.status(204).send();
    }

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.updateProfile = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    displayName: Joi.string().regex(/^\S*$/).regex(/^[a-zA-Z0-9ㄱ-ㅎ가-힣]{4,20}/).required(),
    avatar: Joi.string().allow('')
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  const { email, displayName, avatar } = req.body;

  // in case verification email has been sent out
  let emailSuccessMsg = null;

  // grabs the user information
  let user = null;

  try {

    user = await User.findUserById(req.user._id);

    if (!user) {
      return errorUtils.noUser(res);
    }

  } catch (error) {
    return errorUtils.server(res, error);
  }

  // if email's been edited, send out the verification email
  if (email !== user.email) {

    if (!((new Date() - user.emailLastUpdated) > 24 * 60 * 60 * 1000)) {
      return res.status(403).send({
        message: 'You have to wait at least 24 hours before you can change your email address.'
      });
    }

    try {

      const token = await jwt.sign({ email }, 'email', '24hrs');
      const { envelope } = await mailer.verifyEmailUpdate(token, email);

      if (envelope) {

        emailSuccessMsg = `Verification email has been sent to ${envelope.to}. Please click the link in the email to confirm and start using your new email address.`;

        user.tokenInfo = {
          forField: 'email',
          tokenValue: token
        };

      }

    } catch (error) {
      return errorUtils.server(res, error);
    }

  }

  if (displayName !== user.displayName) {
    user.displayName = displayName;
  }

  if (avatar && avatar !== user.avatar) {
    try {
      user.avatar = await imgCloud.upload(avatar, user._id);
    } catch (error) {
      return errorUtils.server(res, error, 'Failed to upload the profile photo.');
    }
  }

  // save the new user information and re-issue the token
  try {

    const modifiedUser = await user.save();
    const accessToken = await modifiedUser.generateToken();

    return res
      .cookie(cookieKeyName, accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .send({
        user: {
          strategy: modifiedUser.strategy,
          _id: modifiedUser._id,
          email: modifiedUser.email,
          displayName: modifiedUser.displayName,
          avatar: modifiedUser.avatar
        },
        message: 'Your profile has been successfully updated.',
        emailSuccessMsg
      });

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.updateEmail = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    token: Joi.string().required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  const { token } = req.body;

  let email = null;

  try {

    ({ email } = await jwt.verify(token));

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // when the token has expired
      return errorUtils.expiredToken(res);
    }
    return errorUtils.server(res, error);
  }

  try {

    const user = await User.findUserById(req.user._id);

    if (!user) {
      return errorUtils.noUser(res);
    }

    if (user.email === email) {
      return res.status(403).send({
        message: 'The email address has already been updated.'
      });
    }

    if (user.tokenInfo) {

      const { forField, tokenValue } = user.tokenInfo;

      if (forField !== 'email' || tokenValue !== token) {

        return res.status(403).send({
          message: 'The link has expired.'
        });

      } else if (forField === 'email' && tokenValue === token) {

        user.email = email;
        user.tokenInfo.forField = undefined;
        user.tokenInfo.tokenValue = undefined;

        const modifiedUser = await user.save();
        const accessToken = await modifiedUser.generateToken();

        return res
          .cookie(cookieKeyName, accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
          })
          .send({
            user: {
              strategy: modifiedUser.strategy,
              _id: modifiedUser._id,
              email: modifiedUser.email,
              displayName: modifiedUser.displayName,
              avatar: modifiedUser.avatar
            },
            message: 'Your email address has been successfully updated.'
          });

      }

    } else {

      return res.status(403).send({
        message: 'The link is invalid.'
      });

    }

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.deleteAccount = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    password: Joi.string().required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  try {

    const user = await User.findUserById(req.user._id);

    if (!user) {
      return errorUtils.noUser(res);
    }

    const verified = await user.verifyPassword(req.body.password);

    if (!verified) {
      return errorUtils.wrongPwd(res);
    }

    const deletedUser = await user.remove();

    if (deletedUser.email !== user.email) {
      return res.send({
        message: `Failed to delete the account associated with ${user.email}.`
      });
    }

    return res.send({
      message: `The account associated with ${user.email} has been successfully deleted.`
    });

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.getUserActivity = async (req, res) => {

  Activity
    .find({ userId: req.params.userId })
    .populate('payload.post.postId')
    .populate('payload.post.commentId')
    .sort({
      _id: -1
    })
    .limit(PER_PAGE)
    .exec((error, activities) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: 'Could not retrieve activity'
        });
      }

      res.json(activities);
    });
};

/*
    READ ADDITIONAL (OLD/NEW) ACTIVITY OF A USER
*/
module.exports.getUserOldActivity = async (req, res) => {
  const { listType } = req.params;
  const { id } = req.params;

  // CHECK LIST TYPE VALIDITY
  if (listType !== 'old') {
    return res.status(400).json({
      error: 'INVALID LISTTYPE',
      code: 1
    });
  }

  // CHECK MEMO ID VALIDITY
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'INVALID ID',
      code: 2
    });
  }

  const objId = new mongoose.Types.ObjectId(req.params.id);
  // GET OLDER MEMO
  Activity.find({ writer: req.params.username, _id: { $lt: objId } })
    .populate('payload.post.postId')
    .populate('payload.post.commentId')
    .sort({ _id: -1 })
    .limit(PER_PAGE)
    .exec((err, activities) => {
      if (err) throw err;
      return res.json(activities);
    });
};