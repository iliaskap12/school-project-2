const express = require('express');
const router = express.Router();

const path = require('path');
const root = require(path.join('..', __dirname, 'util', 'path'));
const coursesController = require(path.join(root, 'controllers', 'courses'));
const errorController = require(path.join(root, 'controllers', 'error'));

/* GET home page. */
router.get('/courses', function(req, res, next) {
    // courses.html
});

module.exports = router;