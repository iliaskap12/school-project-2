const path = require('path');
const root = require(path.join('..', 'util', 'path'));
const User = require(path.join(root, 'models', 'User'));
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
      req.body.data.user &&
      req.body.data.user._id &&
      req.body.data.sessionId
    ) {
      const result = await User.search(
        { _id: new ObjectId(req.body.data.user._id) },
        { many: false }
      );
      console.log(result.data);
      if (await User.isLoggedIn(req.body.data.sessionId)) {
        res.status(200).json({
          result: {
            success: true,
            data: result.data
          }
        });
      } else {
        res
          .status(401)
          .json({ result: { success: false, data: 'Άρνηση πρόσβασης.' } });
      }
    } else {
      res
        .status(400)
        .json({ result: { success: false, data: 'Ελλιπείς πληροφορίες.' } });
    }
  } catch (e) {
    res
      .status(500)
      .json({ result: { success: false, data: 'Αναπάντεχο σφάλμα.' } });
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
      .json({ result: { success: false, data: 'Ελλιπείς πληροφορίες.' } });
  } else {
    try {
      const result = await User.login(
        req.body.data.username,
        req.body.data.password
      );
      if (result.success) {
        res.status(200).json({
          result: {
            success: true,
            data: { user: result.data.user, sessionId: result.data.sessionId }
          }
        });
      } else {
        res.status(401).json({ result: result });
      }
    } catch (e) {
      res
        .status(500)
        .json({ result: { success: false, data: 'Αναπάντεχο σφάλμα.' } });
    }
  }
}

async function logout (req, res, next) {
  try {
    if (req.body && req.body.sessionId) {
      await User.logout(req.body.sessionId);
      res.json({ success: true, data: null });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: 'Αναπάντεχο σφάλμα.' });
  }
}

module.exports = {
  serveProfilePage: serveProfilePage,
  getProfile: getProfile,
  login: login,
  logout: logout
};
