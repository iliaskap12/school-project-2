const express = require('express');
const router = express.Router();

const path = require('path');
const root = require(path.join('..', 'util', 'path'));
const indexController = require(path.join(root, 'controllers', 'index'));

/* GET home page. */
router.get('/', indexController);

module.exports = router;
