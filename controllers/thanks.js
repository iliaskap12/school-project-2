const path = require('path');
const root = require(path.join('..', 'util', 'path'));

function thanksController (req, res, next) {
  res.sendFile(path.join(root, 'public', 'html', 'thanks.html'));
}

module.exports = thanksController;
