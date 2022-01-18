const path = require('path');
const root = require(path.join('..', 'util', 'path'));

module.exports = (req, res, next) => {
  res.sendFile(path.join(root, 'public', 'html', 'index.html'));
};
