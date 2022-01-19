// Node module
const path = require('path');

// Custom utilities
const root = path.join('..', 'util', 'path');
const uri = require(path.join('..', 'util', 'uri')).uri;

function baseController (req, res, next) {
  res.json({ uri: `${uri.base}` });
}

function categoryController (req, res, next) {
  res.json({ uri: `${uri.categories}` });
}

function coursesController (req, res, next) {
  res.json({ uri: uri.courses });
}

function imagesController (req, res, next) {
  res.json({ uri: `${uri.images}` });
}

module.exports = {
  baseController,
  imagesController,
  coursesController,
  categoryController
};
