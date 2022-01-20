const users = new Map();

function addUser (id, token) {
  users.set(id, token);
}

function removeUser (id) {
  users.delete(id);
}

function isLogged (id, token) {
  return users.get(id) && users.get(id) === token;
}

module.exports = {
  addUser: addUser,
  removeUser: removeUser,
  isLogged: isLogged
};
