// Node module
const path = require('path');

// External dependencies
const express = require('express');

// Express functions
const router = express.Router();

// Custom utilities
const root = path.join('..', 'util', 'path');

// Controllers
const registerControllers = require(path.join('..', 'controllers', 'register'));

router.get('/register', registerControllers.serveRegisterPage);
router.post('/register', registerControllers.registerController);

module.exports = router;
