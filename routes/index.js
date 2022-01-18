const express = require('express');
const router = express.Router();

const path = require('path');
const root = require(path.join('..', __dirname, 'util', 'path'));
const indexController = require(path.join(root, 'controllers', 'index'));
const errorController = require(path.join(root, 'controllers', 'error'));

/* GET home page. */
router.get('/', function (req, res, next) {
  // index
});

module.exports = router;
