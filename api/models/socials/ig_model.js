var mongoose = require("mongoose");

var IgSchema = new mongoose.Schema({
  username: { type: String, default: null },
  password: { type: String, required: false, default: null },
});
module.exports = {
  IgSchema,
};
