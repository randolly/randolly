var mongoose = require("mongoose");

var fbSchema = new mongoose.Schema({
  token: { type: String, default: null },
  pageId: { type: String, required: false },
  userId: { type: String, required: false},
  pageAccessToken: { type: String, required: false },
  llToken: { type: String, required: false, default: null },
  llPageAccessToken: { type: String, required: false, default: null },
});
module.exports = {
  fbSchema
}
