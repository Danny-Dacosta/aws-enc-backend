const crypto = require("crypto");
const { promisify } = require("util");

const generateRSAKeyPair = promisify(crypto.generateKeyPair);
const generateAESKey = () => crypto.randomBytes(32);
const generateIV = () => crypto.randomBytes(16);

const encryptAES = (buffer, key, iv) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  return Buffer.concat([cipher.update(buffer), cipher.final()]);
};

const decryptAES = (encryptedBuffer, key, iv) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
};

module.exports = {
  generateRSAKeyPair,
  generateAESKey,
  generateIV,
  encryptAES,
  decryptAES,
};
