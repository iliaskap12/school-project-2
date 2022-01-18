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

exports.thanks = thanks;
exports.footer = footer;
exports.header = header;
exports.searchResults = searchResults;
