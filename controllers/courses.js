// Node module
const path = require('path');

// Custom utilities
const root = require(path.join('..', 'util', 'path'));
const uri = require(path.join('..', 'util', 'uri'));

function coursesController(req, res, next) {
    res.redirect(path.join('..', 'html', 'courses.html'));
}

module.exports = coursesController;