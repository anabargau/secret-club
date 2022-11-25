const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

exports.message_list = function (req, res, next) {
  Message.find()
    .populate('author')
    .sort({ date: -1 })
    .exec((err, messages) => {
      if (err) {
        return next(err);
      }
      res.render('index', {
        user: res.locals.currentUser,
        messages,
      });
    });
};

exports.new_message_get = function (req, res, next) {
  if (!res.locals.currentUser) {
    return res.render('log_in_form');
  }
  res.render('message_form', {
    user: res.locals.currentUser,
  });
};

exports.new_message_post = [
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('text', 'Content must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      author: res.locals.currentUser,
      date: Date.now(),
    });
    if (!errors.isEmpty()) {
      res.render('message_form', {
        message,
        errors: errors.array(),
      });
      return;
    }
    message.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },
];

exports.delete_message_get = function (req, res, next) {
  if (!res.locals.currentUser) {
    return res.render('log_in_form');
  }
  Message.findById(req.params.id)
    .populate('author')
    .exec((err, message) => {
      if (err) {
        return next(err);
      }
      if (!message) {
        return res.redirect('/');
      }
      res.render('delete_message', {
        message,
        user: res.locals.currentUser,
      });
    });
};

exports.delete_message_post = function (req, res, next) {
  if (!res.locals.currentUser) {
    return res.render('log_in_form');
  }
  Message.findByIdAndRemove(req.body.messageid, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
