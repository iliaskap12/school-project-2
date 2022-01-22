const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db = 'project';

const mongoConnect = callback => {
  MongoClient.connect(`mongodb://localhost:27017/${_db}`)
    .then(client => {
      console.log('Connected!');
      _db = client.db(_db);
      const users = _db.collection('users');
      const sessions = _db.collection('sessions');
      sessions
        .createIndex({ created_at: 1 }, { expireAfterSeconds: 3600 })
        .then(() => {
          console.log('Expiration index created!');
        })
        .catch(e => console.error(e));
      callback();
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
