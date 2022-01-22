const path = require('path');
const root = require(path.join('..', 'util', 'path'));
const User = require(path.join(root, 'models', 'User'));

function serveRegisterPage (req, res, next) {
  res.sendFile(path.join(root, 'public', 'html', 'register.html'));
}

async function registerController (req, res, next) {
  const result = await User.createUser(req.body.data);
  if (result.success) {
    res.status(200).json({
      data: { user: result.data.user, sessionId: result.data.sessionId }
    });
  } else {
    const error = {
      email: result.data.info.email === req.body.data.info.email,
      username: result.data.account.username === req.body.data.account.username
    };
    res.status(403).json({ error });
  }
}

module.exports = {
  serveRegisterPage,
  registerController
};
