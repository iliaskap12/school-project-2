const path = require('path');
const root = require(path.join('..', 'util', 'path'));

function getHomePage(req, res, next) {
  res.sendFile(path.join(root, 'public', 'html', 'index.html'));
}

module.exports = getHomePage;
