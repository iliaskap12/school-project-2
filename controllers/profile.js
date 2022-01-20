const path = require('path');
const root = require(path.join('..', 'util', 'path'));
const User = require(path.join(root, 'models', 'User'));
const users = require(path.join(root, 'util', 'loggedUsers'));
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

function serveProfilePage (req, res, next) {
  res.sendFile(path.join(root, 'public', 'html', 'profile.html'));
}

async function getProfile (req, res, next) {
  try {
    if (
      req.body &&
      req.body.data &&
      req.body.data._security &&
      req.body.data._security._token &&
      req.body.data._security._id
    ) {
      if (
        users.isLogged(
          req.body.data._security._id,
          req.body.data._security._token
        )
      ) {
        console.log(req.body.data);
        res.status(200).json({
          result: {
            success: true,
            data: await User.search(
              { _id: new ObjectId(req.body.data._id) },
              { many: false }
            )
          }
        });
      } else {
        res
          .status(401)
          .json({ result: { success: false, data: 'Access denied.' } });
      }
    } else {
      res
        .status(400)
        .json({ result: { success: false, data: 'Missing information' } });
    }
  } catch (e) {
    res
      .status(500)
      .json({ result: { success: false, data: 'Unexpected error.' } });
  }
}

async function login (req, res, next) {
  if (
    !req.body ||
    !req.body.data ||
    !req.body.data.username ||
    !req.body.data.password
  ) {
    res
      .status(400)
      .json({ result: { success: false, data: 'Missing information' } });
  } else {
    try {
      const result = await User.login(
        req.body.data.username,
        req.body.data.password
      );
      if (result.success) {
        users.addUser(result.data._security._id, result.data._security._token);
        res.status(200).json({ result: result });
      } else {
        res.status(401).json({ result: result });
      }
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ result: { success: false, data: 'Unexpected error.' } });
    }
  }
}

async function logout (req, res, next) {
  try {
    if (
      req.body &&
      req.body.data &&
      req.body.data._token &&
      req.body.data._id
    ) {
      if (users.isLogged(req.body.data._id, req.body.data._token)) {
        users.removeUser(req.body.data._id);
        res.status(200).json({ success: true, data: null });
      } else {
        res.status(401).json({ success: false, data: 'Access denied.' });
      }
    } else {
      res
        .status(400)
        .json({ result: { success: false, data: 'Missing information' } });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: 'Unexpected error.' });
  }
}

module.exports = {
  serveProfilePage: serveProfilePage,
  getProfile: getProfile,
  login: login,
  logout: logout
};
