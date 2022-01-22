const path = require('path');
const root = require(path.join('..', 'util', 'path'));
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');

const getDb = require(path.join(root, 'util', 'database')).getDb;
const ObjectId = mongodb.ObjectId;

class UserDAO {
  static async saveUser (user) {
    try {
      const result = await getDb()
        .collection('users')
        .insertOne(user.toJSON());
      return result.insertedId;
    } catch (e) {
      console.error(e);
    }
  }

  static async saveSession (id) {
    try {
      const result = await getDb()
        .collection('sessions')
        .insertOne({ userId: id });
      return { success: true, data: result.insertedId.toString() };
    } catch (e) {
      console.error(e);
    }
    return { success: false, data: 'Άρνηση πρόσβασης.' };
  }

  static async update (user) {
    try {
      const userData = {
        address: user.address,
        info: user.info,
        account: user.account,
        security: user.security
      };
      const result = await getDb()
        .collection('users')
        .updateOne(userData._id, { $set: userData });
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${
          result.modifiedCount
        } document(s)`
      );
    } catch (e) {
      console.error(e);
    }
  }

  static async isLoggedIn (sessionId) {
    try {
      const result = await UserDAO.search(
        { _id: new ObjectId(sessionId) },
        {
          many: false
        },
        'sessions'
      );
      return result.found;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  static async login (username, password, id) {
    try {
      const result = await UserDAO.search(
        { 'account.username': username },
        false
      );
      const correctCredentials =
        result.found &&
        bcrypt.compareSync(password, result.data.account.password);
      if (!correctCredentials) {
        return {
          success: false,
          data: 'Λάθος email ή συνθηματικό.'
        };
      }
      const ID = id || result.data._id;
      const session = await UserDAO.saveSession(ID);
      if (session.success) {
        return {
          success: true,
          data: {
            user: result.data,
            sessionId: session.data
          }
        };
      } else {
        return session;
      }
    } catch (e) {
      console.error(e);
    }
    return { success: false, data: 'Άρνηση πρόσβασης.' };
  }

  static async logout (sessionId) {
    getDb()
      .collection('sessions')
      .deleteOne({ _id: new ObjectId(sessionId) })
      .catch(e => {
        console.error(e);
      });
  }

  static async search (data, quantity, location) {
    try {
      const collection = location || 'users';
      const db = getDb();
      let returnVal = {
        found: false,
        data: null
      };
      if (quantity.many) {
        const result = await db.collection(collection).find(data);
        if (result) {
          returnVal.found = true;
          returnVal.data = result;
        }
      } else {
        const result = await db.collection(collection).findOne(data);
        if (result) {
          returnVal.found = true;
          returnVal.data = result;
        }
      }
      return returnVal;
    } catch (e) {
      console.error(e);
      return {
        found: false,
        data: null
      };
    }
  }

  static async exists (user) {
    try {
      return await UserDAO.search(
        {
          $or: [
            { 'info.email': user.info.email },
            {
              'account.username': user.account.username
            }
          ]
        },
        {
          many: false
        }
      );
    } catch (e) {
      console.error(e);
      return {
        found: false,
        data: null
      };
    }
  }
}

module.exports = UserDAO;
