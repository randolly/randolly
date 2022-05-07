const User = require("../models/user.model");
const encrpt = require("../lib/encrpt");
// const IgPostModel = require("../models/ig_post_model");
// const cloudinary = require("../lib/cloud");
const assert = require('assert')
// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class FbController {

  // to get long lasting access token
  // https://developers.facebook.com/docs/pages/access-tokens/

  async updateAcc(req, res) {
    
    try {
      // fetch long lasting access_token
      let response = await fetch('https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id='+process.env.FB_APP_ID+'&client_secret='+process.env.FB_SECRET+'&fb_exchange_token='+req.body.token);
      const responseData = await response.json();
      const llToken = responseData.access_token;
      // const expires_in = responseData.expires_in;

      // fetch long lasting page access_token
      let response2 = await fetch('https://graph.facebook.com/'+req.body.pageId+'?fields=access_token&access_token='+llToken);
      const responseData2 = await response2.json();
      const llPageAccessToken = responseData2.access_token;

      // console.log("responseData", responseData);
      // console.log("responseData2", responseData2);
      // update user
      let data = {
        token: encrpt.encrypt(req.body.token),
        pageId: encrpt.encrypt(req.body.pageId),
        pageAccessToken: encrpt.encrypt(req.body.pageAccessToken),
        llToken: encrpt.encrypt(llToken),
        llPageAccessToken: encrpt.encrypt(llPageAccessToken),
      };
      let user = req.user
      assert.ok(user)
      User.findOne({ "facebook.token": null }).then((fb_data) => {
        if (fb_data.length < 1) {
          //if cred do not exist, create
          // console.log("so called fb_data: " + fb_data);
          User.findByIdAndUpdate({_id: user._id}, {$addToSet: {facebook: data}}, {runValidators:true, new: true}).then((d) => {
           return res.json({
                success: true,
                message: "fb credentials uploaded successfully",
                data: d,
              });
          }).catch((err) => res.json({ success: false, message: err }))
        } else {
          //if cred exist, update
          User.findByIdAndUpdate({_id: user._id}, {$set: {facebook: data}}, {runValidators:true, new: true}).then((d) => {
           return res.json({
                success: true,
                message: "fb credentials uploaded successfully",
                data: d,
              });
          }).catch((err) => res.json({ success: false, message: err }))
        }
      });
    } catch (e) {
      console.log(e);
      res.json({ success: false, err: e });
    }
  }
  
}
module.exports = new FbController();
