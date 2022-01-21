// Node module
const path = require('path');

// External dependencies
const express = require('express');

// Express functions
const router = express.Router();

// Custom utilities
const root = path.join('..', 'util', 'path');

// Controllers
const files = require(path.join('..', 'controllers', 'jsfiles'));

router.get('/form', files.form);
router.get('/categories', files.categories);

module.exports = router;
