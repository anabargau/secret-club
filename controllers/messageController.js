const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

exports.message_list = function (req, res, next) {
  res.render('index', {
    user: res.locales.currentUser,
  });
};

exports.new_message_get = function (req, res, next) {};

exports.new_message_post = function (req, res, next) {};

exports.delete_message_get = function (req, res, next) {};

exports.delete_message_post = function (req, res, next) {};
