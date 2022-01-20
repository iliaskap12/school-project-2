const path = require('path');
const root = require(path.join('..', 'util', 'path'));

const getDb = require(path.join(root, 'util', 'database')).getDb;

class UserDAO {
  static async save (user) {
    const userData = {
      address: user._address,
      info: user._info,
      account: user._account
    };
    const result = await getDb()
      .collection('users')
      .insertOne(userData);
    return result.insertedId;
  }

  static async search (data, quantity) {
    const db = getDb();
    let returnVal = {
      found: false,
      data: null
    };
    if (quantity.many) {
      const result = await db.collection('users').find(data);
      if (result) {
        returnVal.found = true;
        returnVal.data = result;
      }
    } else {
      const result = await db.collection('users').findOne(data);
      if (result) {
        returnVal.found = true;
        returnVal.data = result;
      }
    }
    return returnVal;
  }
}

module.exports = UserDAO;
