const express = require('express');
const router = express.Router();

const path = require('path');
const root = require(path.join('..', __dirname, 'util', 'path'));
const userController = require(path.join(root, 'controllers', 'user'));
const errorController = require(path.join(root, 'controllers', 'error'));

/* GET users listing. */
router.post('/register', function (req, res, next) {
  // validation
  // pass -> create user
  //      -> store user
  //      -> login user
  //      -> redirect thank you 401 + user
  // fail -> onerror
  //      -> 422 + validation info
});

router.post('/login', (req, res, next) => {
  // pass -> send user id
  //      -> generate token
  //      -> store token
  //      -> send token
  // fail -> username or password incorrect 422
});

router.get('/profile', (req, res, next) => {
  // pass   -> get id
  //        -> get token
  //        -> validate id + token
  //        -> send profile
  // fail   -> onerror
  //        -> unauthorized 501
});

module.exports = router;
