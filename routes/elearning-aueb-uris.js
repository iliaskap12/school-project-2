// Node module
const path = require('path');

// External dependencies
const express = require('express');

// Express functions
const router = express.Router();

// Custom utilities
const root = path.join('..', 'util', 'path');

// Controllers
const uriController = require(path.join(
  '..',
  'controllers',
  'elearning-aueb-uris'
));

router.get('/uri', uriController.baseController);
router.get('/images-uri', uriController.imagesController);
router.get('/courses-uri', uriController.coursesController);
router.get('/categories-uri', uriController.categoryController);

module.exports = router;
