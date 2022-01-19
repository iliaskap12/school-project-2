const path = require('path');
const root = require(path.join('..', 'util', 'path'));
const views = path.join(root, 'views');

function searchResults (req, res, next) {
  res.sendFile(path.join(views, 'search.hbs'));
}

function headerSection (req, res, next) {
  res.sendFile(path.join(views, 'header.hbs'));
}

function footer (req, res, next) {
  res.sendFile(path.join(views, 'footer.hbs'));
}

function thanks (req, res, next) {
  res.sendFile(path.join(views, 'thanks.hbs'));
}

function coursesHbs (req, res, next) {
  res.sendFile(path.join(views, 'courses.hbs'));
}

function userProfile (req, res, next) {
  res.sendFile(path.join(views, 'profile.hbs'));
}

function registerUser (req, res, next) {
  res.sendFile(path.join(views, 'register.hbs'));
}

function login (req, res, next) {
  res.sendFile(path.join(views, 'login.hbs'));
}

function errorHbs (req, res, next) {
  res.sendFile(path.join(views, 'error.hbs'));
}

function menu (req, res, next) {
  res.sendFile(path.join(views, 'menu.hbs'));
}

module.exports = {
  userProfile,
  coursesHbs,
  thanks,
  menu,
  footer,
  registerUser,
  login,
  errorHbs,
  headerSection,
  searchResults
};
