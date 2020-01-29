const users = require("./users.json");

const userList = users.map(user => {
  const { username, password, custom = {} } = user;
  const mapped = { username, password };
  const customKeys = Object.keys(custom);
  customKeys.forEach(key => {
    mapped[`custom:${key}`] = custom[key];
  });
  return mapped;
});

const findUser = (username, password) => {
  const user = userList.find(u => (u.username = username));
  return user && user.password === password ? user : undefined;
};

module.exports = {
  userList,
  findUser
};
