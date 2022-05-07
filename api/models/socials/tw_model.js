var mongoose = require("mongoose");

var TwSchema = new mongoose.Schema({
  access_token: { type: String, default: null },
  access_token_secret: { type: String, required: false, default: null },
});
module.exports = {
  TwSchema
}
