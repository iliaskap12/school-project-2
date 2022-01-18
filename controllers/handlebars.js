const path = require('path');
const root = require(path.join('..', 'util', 'path'));
const views = require(path.join(root, 'views'));

function searchResults(req, res, next) {
    res.sendFile(path.join(views, 'search.hbs'));
}

exports.searchResults = searchResults;