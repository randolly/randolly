// require("dotenv").config();
const User = require("../models/user.model.js");
const encrpt = require("../lib/encrpt");
const Twit = require("twit");
const dotenv = require("dotenv");

class PostToTw {
  async getTwToken(id) {
    try {
      let doc = await User.findOne({ _id: id }, function (err, doc) {
        if (err) {
          console.log("there is an error 😦 ");
        }
        // console.log("accestoken" + doc.twitter.access_token);
      });
      return new Promise((res, _rej) => {
        res({
          consumer_key: process.env.TW_CONSUMER_KEY,
          consumer_secret: process.env.TW_CONSUMER_SECRET,
          access_token: encrpt.decrpt(doc.twitter.access_token),
          access_token_secret: encrpt.decrpt(doc.twitter.access_token_secret),
        });
      });
    } catch (e) {
      console.log("Error", e);
    }
  }

  postToTwWithImg(id, text, baseEncoding) {
    this.getTwToken(id).then((token) => {
      var cred = new Twit({
        consumer_key: token.consumer_key,
        consumer_secret: token.consumer_secret,
        access_token: token.access_token,
        access_token_secret: token.access_token_secret,
      });
      cred.post(
        "media/upload",
        { media_data: baseEncoding },
        (err, data, response) => {
          var mediaIdStr = data.media_id_string;
          var altText = text;
          var meta_params = {
            media_id: mediaIdStr,
            alt_text: { text: altText },
          };

          cred.post(
            "media/metadata/create",
            meta_params,
            (err, data, response) => {
              if (!err) {
                var params = {
                  status: text,
                  media_ids: [mediaIdStr],
                };
                cred.post(
                  "statuses/update",
                  params,
                  function (err, data, response) {
                    if (data) {
                      console.log("posted to twitter :) with your image");
                    }
                    if (err) {
                      console.log("there is an error 😦 ");
                    }
                    return;
                  }
                );
              }
            }
          );
        }
      );
    });
  }
  PostToTwWithoutImage(id, text) {
    // console.log(this.getTwToken(id).then((token) => {console.log(token)}))
    // var cred = this.getTwToken(id);
    this.getTwToken(id).then((token) => {
      var cred = new Twit({
        consumer_key: token.consumer_key,
        consumer_secret: token.consumer_secret,
        access_token: token.access_token,
        access_token_secret: token.access_token_secret,
      });

      cred.post(
        "statuses/update",
        { status: text },
        function (err, data, response) {
          if (data) {
            console.log("posted to twitter :) without image");
          }
          if (err) {
            console.log("there is an error 😦 ");
          }
        }
      );
    });
  }
}

module.exports = new PostToTw();
