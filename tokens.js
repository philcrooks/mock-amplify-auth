const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");
const keyPairs = require("./keys.json");

const { keys: tokens } = keyPairs;
const privateKeys = tokens.map(pair => ({
  kid: pair.kid,
  alg: pair.alg,
  pem: jwkToPem(pair, { private: true })
}));
const publicKeys = tokens.map(pair => ({
  kid: pair.kid,
  alg: pair.alg,
  pem: jwkToPem(pair)
}));
const audience = "mock-auth";
const issuer = "https://cognito-idp.local.amazonaws.com/local_mock-auth";

const getPrivateKey = () => {
  const index = Math.round(Math.random() * 100) % tokens.length;
  return privateKeys[index];
};

const findPublicKey = kid => publicKeys.find(k => k.kid === kid);

const encodeJwt = (username, email) => {
  return new Promise((resolve, reject) => {
    const timeS = Math.floor(Date.now() / 1000);
    const payload = {
      sub: username,
      token_use: "id",
      email_verified: true,
      aud: audience,
      auth_time: timeS,
      iat: timeS,
      exp: timeS + 100000,
      iss: issuer,
      "cognito:username": username,
      email
    };
    const { kid: keyid, alg: algorithm, pem } = getPrivateKey();
    jwt.sign(payload, pem, { keyid, algorithm }, (err, signed) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(signed);
    });
  });
};

const decodeJwt = token => {
  return new Promise((resolve, reject) => {
    const decoded = jwt.decode(token, { complete: true });
    if (decoded) {
      const { header } = decoded;
      const key = findPublicKey(header.kid);
      if (key && header.alg === key.alg) {
        const options = { algorithms: [key.alg], audience, issuer };
        jwt.verify(token, key.pem, options, (err, verified) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(verified);
        });
      }
    }
  });
};

module.exports = {
  encodeJwt,
  decodeJwt
};
