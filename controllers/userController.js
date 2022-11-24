const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
require('dotenv').config();

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
        res.redirect('/user/log_in');
      });
    });
  },
];

exports.log_in_get = function (req, res, next) {
  res.render('log_in_form');
};

exports.log_in_post = passport.authenticate('local', {
  failureRedirect: '/user/log_in',
  failureMessage: true,
  successRedirect: '/',
});

exports.insider_get = function (req, res, next) {
  if (!res.locals.currentUser) {
    return res.redirect('/log_in_form');
  }
  res.render('passcode_form', {
    title: 'Become an insider member',
    user: res.locals.currentUser,
  });
};

exports.insider_post = [
  body('passcode', 'Please enter your passcode')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('passcode_form', {
        title: 'Become an insider member',
        user: res.locals.currentUser,
        errors: errors.array(),
      });
      return;
    }
    if (req.body.passcode !== process.env.INSIDER_SECRET) {
      res.render('passcode_form', {
        title: 'Become an insider member',
        user: res.locals.currentUser,
        errors: [{ msg: 'Incorrect passcode' }],
      });
      return;
    }
    const user = new User(res.locals.currentUser);
    user.membership_status = 'insider';
    User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err) => {
      return next(err);
    });
    res.redirect('/');
  },
];

exports.admin_get = function (req, res, next) {
  if (!res.locals.currentUser) {
    return res.redirect('/log_in_form');
  }
  res.render('passcode_form', {
    title: 'Become an admin',
    user: res.locals.currentUser,
  });
};

exports.admin_post = [
  body('passcode', 'Please enter your passcode')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('passcode_form', {
        title: 'Become an admin',
        errors: errors.array(),
        user: res.locals.currentUser,
      });
      return;
    }
    if (req.body.passcode !== process.env.ADMIN_SECRET) {
      res.render('passcode_form', {
        title: 'Become an admin',
        user: res.locals.currentUser,
        errors: [{ msg: 'Incorrect passcode' }],
      });
      return;
    }
    const user = new User(res.locals.currentUser);
    user.membership_status = 'admin';
    User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },
];

exports.log_out = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
