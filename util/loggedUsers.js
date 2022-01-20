const users = new Map();

function addUser (id, token) {
  users.set(id, token);
}

function removeUser (id) {
  users.delete(id);
}

module.exports = {
  addUser,
  removeUser
};
