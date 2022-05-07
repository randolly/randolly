const User = require("../models/user.model");
const encrpt = require("../lib/encrpt");
// const twPostSchema = require("../models/tw_post_model");
// const cloudinary = require("../lib/cloud");
const {
  serializeUser,
  serializeUsers,
} = require("../serializers/user.serializer");
const assert = require('assert')


// hey
class TwController {
 updateAcc(req, res) {
    
    try {
      let data = {
        access_token: encrpt.encrypt(req.body.access_token),
        access_token_secret: encrpt.encrypt(req.body.access_token_secret),
      };
      let user = req.user
      assert.ok(user)
      User.findOne({ "twitter.access_token": null }).then((tw_data) => {
        if (tw_data.length < 1) {
          //if cred do not exist, create
          console.log("so called tw_data: " + tw_data);
          User.findByIdAndUpdate({_id: user._id}, {$addToSet: {twitter: data}}, {runValidators:true, new: true}).then((d) => {
           return res.json({
                success: true,
                message: "tw credentials uploaded successfully",
                data: d,
              });
          }).catch((err) => res.json({ success: false, message: err }))
        } else {
          //if cred exist, update
          User.findByIdAndUpdate({_id: user._id}, {$set: {twitter: data}}, {runValidators:true, new: true}).then((d) => {
           return res.json({
                success: true,
                message: "tw credentials uploaded successfully",
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

  // AddPost(req, res) {
  //   let data = {
  //     image: req.files,
  //     text: req.body.text,
  //     // schedule: new Date(req.body.schedule),
  //   };
  //   try {
  //     twSchema.find({}, (err, tw_data) => {
  //       if (tw_data < 1) {
  //         return res.json({
  //           success: false,
  //           message: "upload a twitter token before you schedule a post",
  //         });
  //       } else {
  //         if (data.image) {
  //           cloudinary.pics_upload(data.image.image.data).then((file_data) => {
  //             data.image = file_data.secure_url;
  //             twPostSchema.create(data, (err, post) => {
  //               if (err) {
  //                 return res.json({
  //                   success: false,
  //                   message: "error schedulng post",
  //                   err: err,
  //                 });
  //               } else {
  //                 return res.json({
  //                   success: true,
  //                   message: "post scheduled successfully",
  //                   data: post,
  //                 });
  //               }
  //             });
  //           });
  //         } else {
  //           twPostSchema.create(data, (err, post) => {
  //             if (err) {
  //               return res.json({
  //                 success: false,
  //                 message: "error schedulng post",
  //                 err: err,
  //               });
  //             } else {
  //               return res.json({
  //                 success: true,
  //                 message: "post scheduled successfully",
  //                 data: post,
  //               });
  //             }
  //           });
  //         }
  //       }
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     res.json({ success: false, err: e });
  //   }
  // }

  // updatePost(req, res) {
  //   let id = { _id: req.params.id };
  //   let data = {
  //     text: req.body.text,
  //     // schedule: new Date(req.body.schedule),
  //   };
  //   try {
  //     twPostSchema.findByIdAndUpdate(id, data, (err) => {
  //       if (err) {
  //         return res.json({
  //           success: false,
  //           message: "error updating post",
  //           err: err,
  //         });
  //       } else {
  //         return res.json({
  //           success: true,
  //           message: "post updated successfully",
  //         });
  //       }
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     res.json({ success: false, err: e });
  //   }
  // }

  // deletePost(req, res) {
  //   let id = { _id: req.params.id };
  //   try {
  //     twPostSchema.findByIdAndRemove(id, (err) => {
  //       if (err) {
  //         return res.json({
  //           success: false,
  //           message: "error deleting post",
  //           err: err,
  //         });
  //       } else {
  //         return res.json({
  //           success: true,
  //           message: "post deleted successfully",
  //         });
  //       }
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     res.json({ success: false, err: e });
  //   }
  // }

  // getPost(req, res) {
  //   try {
  //     twPostSchema.find({}, (err, post) => {
  //       if (err) {
  //         return res.json({
  //           success: false,
  //           message: "error getting post",
  //           err: err,
  //         });
  //       } else {
  //         return res.json({
  //           success: true,
  //           message: "data gotten successfully",
  //           data: post,
  //         });
  //       }
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     res.json({ success: false, err: e });
  //   }
  // }
}
module.exports = new TwController();
