const path = require('path');
const root = require(path.join('..', 'util', 'path'));

const mongodb = require('mongodb');
const getDb = require(path.join(root, 'util', 'database')).getDb;

const ObjectId = mongodb.ObjectId;
const UserDAO = require(path.join(root, 'middleware', 'UserDAO'));

class User {
  #username;
  #_id;
  #email;

  constructor (username, email, id) {
    this.#username = username;
    this.#email = email;
    this.#_id = id;
  }

  save () {
    UserDAO.save(this);
  }

  static findById (userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
