const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const jwtUtils = require('../../utils/jwtUtils');

const UserSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  strategy: String,
  email: String,
  password: {
    type: String,
    select: false
  },
  displayName: String,
  avatar: String,
  social: {
    id: String,
    accessToken: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  privilege: {
    type: String,
    default: 'newbie'
  }
});

UserSchema.statics.findUserById = function (id) {

  return this.findById(id).select('+password');

};

UserSchema.statics.findUserByEmail = function (email) {

  return this.findOne({ email }).select('+password');

};

UserSchema.statics.findUserByDisplayName = function (displayName) {

  return this.findOne({ displayName });

};

UserSchema.statics.findUserBySocialProfile = function ({ provider, social }) {

  return this.findOne({
    strategy: provider,
    'social.id': social.id
  });

};

UserSchema.statics.registerLocalUser = function (newLocalUser) {

  const {
    email, password, displayName, avatar
  } = newLocalUser;

  const newUser = new this({
    strategy: 'local',
    email,
    password,
    displayName,
    avatar
  });

  return newUser.save();

};

UserSchema.statics.registerSocialUser = function (newSocialUser) {

  const {
    strategy, email, displayName, avatar, socialId, socialToken
  } = newSocialUser;

  const newUser = new this({
    strategy,
    email,
    displayName,
    avatar: avatar || null,
    social: {
      id: socialId,
      accessTokeN: socialToken
    }
  });

  return newUser.save();

};

UserSchema.statics.findLocalUser = function (email, password) {

  const User = this;

  return User
    .findOne({
      strategy: 'local',
      email
    })
    .then((user) => {

      if (!user) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {

        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });

      });

    });

};

UserSchema.methods.verifyPassword = function (password) {

  return bcrypt.compare(password, this.password);

};

UserSchema.methods.generateToken = function () {

  const {
    strategy,
    _id,
    email,
    displayName,
    avatar
  } = this;

  return jwtUtils.sign({
    user: {
      strategy,
      _id,
      email,
      displayName,
      avatar
    }
  }, 'user');

};

UserSchema.pre('save', function (next) {

  const user = this;

  if (user.isModified('password')) {

    bcrypt.genSalt(10, (err1, salt) => {

      if (err1) throw err1;

      bcrypt.hash(user.password, salt, (err2, hash) => {

        if (err2) throw err2;

        user.password = hash;
        next();

      });

    });

  } else {

    next();

  }

});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
