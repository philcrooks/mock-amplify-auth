const { test } = require("tap");
const { encodeJwt, decodeJwt } = require("../tokens");

let token;

test("can encode a token", async t => {
  token = await encodeJwt("username", "email@email.com");
});

test("can decode a token", async t => {
  const { sub, email } = await decodeJwt(token);
  t.equal(sub, "username");
  t.equal(email, "email@email.com");
});
