const User = require("../models/user.model.js");
const encrpt = require("../lib/encrpt");
const Instagram = require("instagram-web-api");

class PostToIg {
  async getIgToken(id) {
    try {
      let doc = await User.findOne({ _id: id }, function (err, doc) {
        if (err) {
          console.log("there is an error 😦 ");
        }
        // console.log("accestoken" + doc.twitter.access_token);
      });
      return new Promise((res, _rej) => {
        res({
          username: encrpt.decrpt(doc.instagram.username),
          password: encrpt.decrpt(doc.instagram.password),
        });
      });
    } catch (e) {
      console.log("Error 😦 getting ig data", e);
    }
  }

  PostToIg(id, text, url) {
    this.getIgToken(id).then(async (cred) => {
      try {
        console.log("posting to instagram...");
        const { username, password } = cred;
        const client = new Instagram({
          username: username,
          password: password,
        });
        client.login().then(async () => {
          const { media } = await client.uploadPhoto({
            photo: url,
            caption: text,
            post: "feed",
          });
          console.log(
            `uploaded successful https://www.instagram.com/p/${media.code}/`
          );
        });
      } catch (e) {
        console.log("Error 😦 posting to instagram", e);
      }
    });
  }
}

module.exports = new PostToIg();
