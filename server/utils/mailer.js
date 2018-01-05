const nodemailer = require('nodemailer');

const {
  REACT_APP_emailProvider: provider,
  REACT_APP_emailAccount: account,
  REACT_APP_emailPassword: password
} = process.env;

const transporter = nodemailer.createTransport({
  service: provider,
  auth: {
    user: account,
    pass: password
  }
});

const mailOptions = (token, email) => {
  const url = `http://localhost:4000/user/verify/${token}`;
  return {
    from: account,
    to: email,
    subject: 'This is from CK board ✔',
    text: url,
    html: `
      <p>This shit will expire in 24 hours.</p>
      <a href="${url}">Go Verify The Fuck Yourself !!!</a>
    `
  };
};

const mailOptionss = (token, email) => {
  const url = `http://localhost:4000/user/settings/${token}`;
  return {
    from: account,
    to: email,
    subject: 'This is from CK board ✔',
    text: url,
    html: `
      <p>This shit will expire in 24 hours.</p>
      <p>Click the link below to confirm your new email address.</p>
      <a href="${url}">Go Verify The Fuck Yourself !!!</a>
    `
  };
};

const mailOptionsss = (token, email) => {
  const url = `http://localhost:4000/user/reset/${token}`;
  return {
    from: account,
    to: email,
    subject: 'This is from CK board ✔',
    text: url,
    html: `
      <p>This shit will expire in 24 hours.</p>
      <p>Click the link below to reset your password.</p>
      <a href="${url}">Go Verify The Fuck Yourself !!!</a>
    `
  };
};

module.exports.verifyNewEmail = (token, email) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions(token, email), (error, info) => {
      if (error) {
        reject(error);
      }
      resolve(info);
    });
  });
};

module.exports.verifyEmailUpdate = (token, email) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptionss(token, email), (error, info) => {
      if (error) {
        reject(error);
      }
      resolve(info);
    });
  });
};

module.exports.requestPwdReset = (token, email) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptionsss(token, email), (error, info) => {
      if (error) {
        reject(error);
      }
      resolve(info);
    });
  });
};