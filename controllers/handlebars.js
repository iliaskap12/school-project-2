const path = require('path');
const root = require(path.join('..', 'util', 'path'));
const views = path.join(root, 'views');

function searchResults (req, res, next) {
  res.sendFile(path.join(views, 'search.hbs'));
}

function header (req, res, next) {
  res.sendFile(path.join(views, 'header.hbs'));
}

function footer (req, res, next) {
  res.sendFile(path.join(views, 'footer.hbs'));
}

function thanks (req, res, next) {
  res.sendFile(path.join(views, 'thanks.hbs'));
}

function courses (req, res, next) {
  res.sendFile(path.join(views, 'courses.hbs'));
}

function profile (req, res, next) {
  res.sendFile(path.join(views, 'profile.hbs'));
}

function register (req, res, next) {
  res.sendFile(path.join(views, 'register.hbs'));
}

function error (req, res, next) {
  res.sendFile(path.join(views, 'error.hbs'));
}

exports.profile = profile;
exports.courses = courses;
exports.thanks = thanks;
exports.footer = footer;
exports.register = register;
exports.error = error;
exports.header = header;
exports.searchResults = searchResults;
