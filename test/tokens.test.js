const { test } = require("tap");
const { encodeJwt, decodeJwt } = require("../tokens");
const { userList } = require("../users");

const [user] = userList;
let token;

test("can encode a token", async t => {
  token = await encodeJwt(user, "username");
});

test("can decode a token", async t => {
  const decoded = await decodeJwt(token);
  t.equal(decoded.sub, "username");
  t.equal(decoded.username, user.username);
});
