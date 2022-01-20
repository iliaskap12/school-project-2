const path = require('path');
const bcrypt = require('bcrypt');
const root = require(path.join('..', 'util', 'path'));

const UserDAO = require(path.join(root, 'middleware', 'UserDAO'));

class User {
  #_address;
  #_info;
  #_account;
  #_security;

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
    return await UserDAO.save(this);
  }

  set _security (security) {
    this.#_security = security;
  }

  get _security () {
    return this.#_security;
  }

  get _address () {
    return this.#_address;
  }

  get _info () {
    return this.#_info;
  }

  get _account () {
    return this.#_account;
  }

  static async search (data, quantity) {
    return await UserDAO.search(data, quantity);
  }

  static generateToken (id) {
    return bcrypt.hashSync(`${id}`, bcrypt.genSaltSync(10));
  }

  static async login (username, password) {
    const result = await User.search({ 'account.username': username }, false);
    let returnVal = { success: false, data: 'Username or password incorrect.' };
    if (
      result.found &&
      bcrypt.compareSync(password, result.data.account.password)
    ) {
      result.data._security = { _id: null, _token: null };
      result.data._security._token = User.generateToken(
        result.data._id.toString()
      );
      result.data._security._id = result.data._id.toString();
      returnVal = { success: true, data: result.data };
    }
    return returnVal;
  }

  static async createUser (userData) {
    try {
      const user = new User(userData);
      const result = await User.search(
        {
          $or: [
            { 'info.email': userData.info.email },
            {
              'account.username': userData.account.username
            }
          ]
        },
        {
          many: false
        }
      );
      if (result.found) {
        return { success: false, data: result.data };
      }
      const id = await user.save();
      const token = User.generateToken(id.toString());
      user._security = { _id: id.toString(), _token: token };
      return { success: true, data: user };
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = User;
