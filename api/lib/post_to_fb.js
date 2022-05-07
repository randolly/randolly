// const FB = require("fb");
const axios = require("axios");
const User = require("../models/user.model.js");
const encrpt = require("../lib/encrpt");
const fs = require("fs");


class PostToFb {
  async getFbToken(id) {
    try {
      let doc = await User.findOne({ _id: id }, function (err, doc) {
        if (err) {
          console.log("there is an error 😦 ");
        }
        // console.log("accestoken" + doc.twitter.access_token);
        
      });
      return new Promise((res, _rej) => {
        res({
          accessToken: encrpt.decrpt(doc.facebook.llToken),
          pageId: encrpt.decrpt(doc.facebook.pageId),
          pageAccessToken: encrpt.decrpt(doc.facebook.llPageAccessToken),
      })
    })
      
    } catch (e) {
      console.log("Error", e);
    }
  }
      // let data = fb.linked.linked_socials.facebook
      // return new Promise((res, _rej) => {
      //   res({
      //     accessToken: encrpt.decrpt(data.token),
      //     pageId: encrpt.decrpt(data.pageId),
      //     pageAccessToken: encrpt.decrpt(data.pageAccessToken),
      //   });
      // });

      // post data method
postData = (url, data, callback) => {

  axios
    .post(
      "https://graph.facebook.com/v12.0/" + url,
      {},
      {
        params: data,
      }
    )
    .then(callback)
    .catch((error) => {
      console.log("😦 an error occured " + error);
    });
}
  
  postToFbWithImg(id, text, image) {
    // remember to change the following into page
    this.getFbToken(id).then((token) => {
      console.log("posting with image to facebook...");
      if (token.pageId === null || token.pageId === undefined) {
        // FB.setAccessToken(token.accessToken);

         this.postData(
          "me/photos",
          {
            access_token: token.accessToken,
            url: image,
            caption: text,
          },
          function (res) {
            if (!res || res.error) {
              console.log(!res ? "error occurred" : res.error);
              return;
            } else {
              console.log("Post Id: " + res.post_id);
              return;
            }
          }
        );
      } else {
        this.postData(
          `${token.pageId}/photos`,
          {
            access_token: token.pageAccessToken,
            url: image,
            caption: text,
          },
          function (res) {
            if (!res || res.error) {
              console.log(!res ? "error occurred" : res.error);
              return;
            } else {
              console.log("Post Id: " + res.post_id);
              return;
            }
          }
        );
      }
    });
  }

  postToFbWithoutImg(id, text) {
    this.getFbToken(id).then((token) => {
      // console.log("token", token);
      if (token.pageId === null || token.pageId === undefined) {
        // FB.setAccessToken(token.accessToken);

        this.postData(
          "me/feed",
          { access_token: token.accessToken, message: text },
          (res) => {
            if (!res || res.error) {
              console.log(!res ? "error occurred" : res.error);
              return;
            }
            console.log("Post Id: " + res.id);
          }
        );
      } else {
        this.postData(
          `${token.pageId}/feed`,
          {
            access_token: token.pageAccessToken,
            message: text,
          },
          (res) => {
            if (!res || res.error) {
              console.log(!res ? "error occurred" : res.error);
              return;
            }
            console.log("Post Id: " + res.id);
          }
        );
      }
    });
  };
}

module.exports = new PostToFb();
