// Node module
const path = require('path');

// External dependencies
const express = require('express');

// Express functions
const router = express.Router();

// Custom utilities
const root = path.join('..', 'util', 'path');
console.log(root)

// Controllers
const coursesController = require(path.join('..', 'controllers', 'courses'));

router.get('/courses', coursesController);

module.exports = router;
