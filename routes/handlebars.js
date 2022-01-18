const express = require('express');
const router = express.Router();

const path = require('path');
const root = require(path.join('..', 'util', 'path'));
const handlebarsControllers = require(path.join(
  root,
  'controllers',
  'handlebars'
));
const errorController = require(path.join(root, 'controllers', 'error'));

router.get('/header', (req, res, next) => {});

router.get('/search', handlebarsControllers.searchResults);

router.get('/search-results', (req, res, next) => {});

router.get('/courses', function (req, res, next) {});

router.get('/thanks', (req, res, next) => {});

router.get('/register', (req, res, next) => {});

router.get('/login', (req, res, next) => {});

router.get('/profile:id', (req, res, next) => {});

module.exports = router;
