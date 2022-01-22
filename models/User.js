const path = require('path');
const bcrypt = require('bcrypt');
const root = require(path.join('..', 'util', 'path'));

const UserDAO = require(path.join(root, 'middleware', 'UserDAO'));

class User {
  #_id;
  #_address;
  #_info;
  #_account;

  constructor (userData) {
    this.#_address = userData.address;
    this.#_info = userData.info;
    this.#_account = userData.account;
    const salt = bcrypt.genSaltSync(10);
    this.#_account.password = bcrypt.hashSync(
      `${this.#_account.password}`,
      salt
    );
  }

  async save () {
    return await UserDAO.saveUser(this);
  }

  async update () {
    await UserDAO.update(this);
  }

  set _id (id) {
    this.#_id = id;
  }

  get _id () {
    return this.#_id;
  }

  get address () {
    return this.#_address;
  }

  get info () {
    return this.#_info;
  }

  get account () {
    return this.#_account;
  }

  static async search (data, quantity) {
    return await UserDAO.search(data, quantity);
  }

  static async login (username, password, id) {
    return await UserDAO.login(username, password, id);
  }

  static async logout (sessionId) {
    return await UserDAO.logout(sessionId);
  }

  static async isLoggedIn (sessionId) {
    return await UserDAO.isLoggedIn(sessionId);
  }

  async exists () {
    return await UserDAO.exists(this);
  }

  static async createUser (userData) {
    const plainTextPassword = userData.account.password;
    try {
      const user = new User(userData);
      const result = await user.exists();
      if (result.found) {
        return { success: false, data: result.data };
      }
      user._id = await user.save();
      const data = await User.login(
        user.account.username,
        plainTextPassword,
        user._id
      );
      if (!data.success) {
        return data;
      }
      return {
        success: true,
        data: { user: user, sessionId: data.data.sessionId }
      };
    } catch (err) {
      console.error(err);
    }
    return { success: false, data: 'Αναπάντεχο σφάλμα' };
  }

  toJSON () {
    let self = {};
    if (this.#_id) {
      self._id = this.#_id;
    }
    self.account = this.#_account;
    self.info = this.#_info;
    self.address = this.#_address;
    return self;
  }
}

module.exports = User;
