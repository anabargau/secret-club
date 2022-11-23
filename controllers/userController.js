const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.sign_up_get = function (req, res, next) {
  res.render('sign_up_form', {
    title: 'Sign Up',
  });
};

exports.sign_up_post = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Username must not be empty')
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        User.findOne({ username: value }, (err, user) => {
          if (err) {
            reject(new Error('Server Error'));
          }
          if (user) {
            reject(new Error('Username already taken.'));
          }
          resolve(true);
        });
      });
    }),
  body('password', 'Password must not be empty').isLength({ min: 1 }),
  body(
    'confirm_password',
    'Confirm password field must have the same value as the password field'
  ).custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, (err, hash_password) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        username: req.body.username,
        password: hash_password,
        membership_status: 'new',
      });
      if (!errors.isEmpty()) {
        res.render('sign_up_form', {
          title: 'Sign Up',
          user,
          errors: errors.array(),
        });
        return;
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  },
];

exports.log_in_get = function (req, res, next) {
  res.render('log_in_form', {
    title: 'Log In',
  });
};

exports.log__in_post = function (req, res, next) {};

exports.insider_get = function (req, res, next) {};

exports.insider_post = function (req, res, next) {};

exports.admin_get = function (req, res, next) {};

exports.admin_post = function (req, res, next) {};

exports.log_out = function (req, res, next) {};
