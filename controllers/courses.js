// Node module
const path = require('path');
const { URLSearchParams } = require('url');

// Custom utilities
const root = require(path.join('..', 'util', 'path'));
const uri = require(path.join('..', 'util', 'uri'));

function coursesController (req, res, next) {
  res.redirect(
    301,
    path.join('..', 'courses.html') + '?' + new URLSearchParams(req.query)
  );
}

module.exports = coursesController;
