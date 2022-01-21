const path = require('path');
const root = require(path.join('..', 'util', 'path'));

function form (req, res, next) {
  res.sendFile(path.join(root, 'public', 'javascripts', 'form.js'));
}

function categories (req, res, next) {
  res.sendFile(path.join(root, 'public', 'javascripts', 'categories.js'));
}

module.exports = {
  form: form,
  categories: categories
};
