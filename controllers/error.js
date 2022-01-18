const path = require('path');
const root = require(path.join('..', __dirname, 'util', 'path'));

exports.get404 = (req, res, next) => {
    res.status(404).sendFile(path.join(root, 'public', 'html', '404.html'));
};