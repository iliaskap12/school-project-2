// Node module
const path = require('path');

// External dependencies
const express = require('express');

// Express functions
const router = express.Router();

// Custom utilities
const root = path.join('..', 'util', 'path');

// Controllers
const profileControllers = require(path.join('..', 'controllers', 'profile'));

router.get('/profile', profileControllers.serveProfilePage);
router.post('/get-profile', profileControllers.getProfile);
router.post('/profile', profileControllers.login);
router.post('/logout', profileControllers.logout);

module.exports = router;
