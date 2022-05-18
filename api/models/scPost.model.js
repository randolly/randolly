const mongoose = require("mongoose");
require("mongoose-long")(mongoose);
const internal_setting = require("./internal_setting.model");
const User = require("./user.model");
// import baseEncoding from '../lib/url_to_base64';
const schedule_postSchema = mongoose.Schema(
  {
    posted: { type: Boolean, default: false },
    schedule: String,
    timeZone: String,
    yymmdd: { type: String, default: null },
    created_at: { type: Date, default: Date.now }, //"Thu Apr 30 12:11:23 +0000 2020",
    id: { type: mongoose.Schema.Types.Long, unique: true },
    id_str: { type: String, unique: true },
    image: { type: String },
    cross_post_options: [{ platform: String, status: String }],
    text: {
      type: String,
      index: "text",
      required: true,
    },
    source: String,
    truncated: { type: Boolean, default: false },
    in_reply_to_status_id: { type: mongoose.Schema.Types.Long, default: null },
    in_reply_to_status_id_str: { type: String, default: null },
    in_reply_to_user_id: { type: mongoose.Schema.Types.Long, default: null },
    in_reply_to_user_id_str: { type: String, default: null },
    in_reply_to_screen_name: { type: String, default: null },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    entities: {
      hashtags: [
        {
          type: Object,
          index: true,
        },
      ],
      symbols: [{}],
      user_mentions: [{}],
      urls: [{}],
      media: [{}],
    },
    extended_entities: {
      media: [{}],
    },
    geo: {}, //N/I
    coordinates: {}, //N/I
    place: {}, //N/I
    contributors: {}, //N/I

    is_quote_status: { type: Boolean, default: false },
    quoted_status_id: { type: mongoose.Schema.Types.Long },
    quoted_status_id_str: { type: String },
    quoted_status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    retweeted_status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    retweet_count: { type: Number, default: 0 },
    favorite_count: { type: Number, default: 0 },
    reply_count: { type: Number, default: 0 },

    //for personalised post objects (serialized)
    favorited: { type: Boolean, default: false },
    retweeted: { type: Boolean, default: false },
    lang: { type: String, default: null },
  },
  { id: false }
);
let sPage = 15;
/**
 * addes a post for specific user
 * @param {String} username - screen_name of user
 * @param {Object} post - post body (partial) to add, must-have feilds: text, ...
 * @returns {Promise} -  One returned by mongoose
 */
schedule_postSchema.statics.addOne = async function (
  { username: screen_name = null, user_id = null },
  post
) {
  if (!user_id) {
    let { _id } = await User.findOne({ screen_name }, "_id");
    user_id = _id;
  }
  let id = await post_genId();

  return mongoose.model("SCPost").create({
    ...post,
    user: user_id,
    id: id,
    id_str: id.toString(),
  });
};
schedule_postSchema.statics.getUserTimeline = async function ({
  username: screen_name = null,
  user_id = null,
}) {
  if (!user_id) {
    let { _id } = await mongoose
      .model("User")
      .findOne({ screen_name: screen_name }, "_id");
    if (!_id) throw Error("Cannot find User");
    user_id = _id;
  }
  return this.find({
    user: user_id,
  }).sort("-created_at");
};
schedule_postSchema.statics.getInSpecificDay = async function ({
  username: screen_name = null,
  user_id = null,
  date_without_time = null,
}) {
  if (!user_id) {
    let { _id } = await mongoose
      .model("User")
      .findOne({ screen_name: screen_name }, "_id");
    if (!_id) throw Error("Cannot find User");
    user_id = _id;
  }
  return this.find({
    user: user_id,
    yymmdd: date_without_time,
  }).sort("-created_at");
};
async function post_genId() {
  /**
   * generates simple incrementing value
   * last value alotted is stored in internals collection as last_id_allotted
   */
  await internal_setting.updateOne(
    { ver: "1.0" },
    {
      $inc: { current_post_id: 1 },
    },
    { upsert: true }
  );
  let { current_post_id } = await internal_setting.findOne(
    { ver: "1.0" },
    "current_post_id"
  );
  return current_post_id;
}

module.exports = mongoose.model("SCPost", schedule_postSchema);
