// Node module
const path = require('path');

// External dependencies
const express = require('express');

// Express functions
const router = express.Router();

// Custom utilities
const root = path.join('..', 'util', 'path');

// Controllers
const handlebarsControllers = require(path.join(
  '..',
  'controllers',
  'handlebars'
));

router.get('/header', handlebarsControllers.headerSection);
router.get('/footer', handlebarsControllers.footer);
router.get('/error', handlebarsControllers.errorHbs);
router.get('/search', handlebarsControllers.searchResults);
router.get('/menu', handlebarsControllers.menu);
router.get('/courses', handlebarsControllers.coursesHbs);
router.get('/thanks', handlebarsControllers.thanks);
router.get('/register', handlebarsControllers.registerUser);
router.get('/login', handlebarsControllers.login);
router.get('/profile:id', handlebarsControllers.userProfile);

module.exports = router;
