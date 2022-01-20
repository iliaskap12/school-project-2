// Node module
const path = require('path');

// External dependencies
const express = require('express');

// Express functions
const router = express.Router();

// Custom utilities
const root = path.join('..', 'util', 'path');

// Controllers
const thanksController = require(path.join('..', 'controllers', 'thanks'));

router.get('/thanks', thanksController);

module.exports = router;
