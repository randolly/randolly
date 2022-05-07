require("dotenv").config();
var Cryptr = require("cryptr");
var cryptr = new Cryptr(process.env.ENCRYPT_SECRET);
class Encrypt {
  encrypt(data) {
    return cryptr.encrypt(data);
  }
  decrpt(data) {
    return cryptr.decrypt(data);
  }
}

module.exports = new Encrypt();
