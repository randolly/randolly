const User = require("../models/user.model");
const encrpt = require("../lib/encrpt");
// const IgPostModel = require("../models/ig_post_model");
// const cloudinary = require("../lib/cloud");
const assert = require('assert')


class IgController {

  updateAcc(req, res) {
    
    try {
      let data = {
        username: encrpt.encrypt(req.body.username),
        password: encrpt.encrypt(req.body.password),
      };
      let user = req.user
      assert.ok(user)
      User.findOne({ "instagram.username": null }).then((ig_data) => {
        if (ig_data.length < 1) {
          //if cred do not exist, create
          console.log("so called ig_data: " + ig_data);
          User.findByIdAndUpdate({_id: user._id}, {$addToSet: {instagram: data}}, {runValidators:true, new: true}).then((d) => {
              return res.json({
                success: true,
                message: "ig credentials uploaded successfully",
                data: d,
              });
          }).catch((err) => res.json({ success: false, message: err }))
        } else {
          //if cred exist, update
          User.findByIdAndUpdate({_id: user._id}, {$set: {instagram: data}}, {runValidators:true, new: true}).then((d) => {
           return res.json({
                success: true,
                message: "ig credentials uploaded successfully",
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
  // findTest(req, res) {
  //   try {
  //     let username = req.params.username;
  //     User.findOne({ screen_name: username }).then((data) => {
  //       return res.json({
  //         success: true,
  //         message: "fuck you",
  //         twitter: data.twitter,
  //         twpassword: encrpt.decrpt(data.twitter.access_token),
  //         igpassword: encrpt.decrpt(data.instagram.password),
  //         data: data,
  //       })})
  //   }catch (e){
  //     console.log(e)
  //     res.json({ success: false, err: e });
  //   }
  // }

  // AddPost(req, res) {
  //   let data = {
  //     image: req.files,
  //     text: req.body.text,
  //     // schedule: new Date(req.body.schedule),
  //   };
  //   try {
  //     IgSchema.find({}, (err, ig_data) => {
  //       if (ig_data < 1) {
  //         return res.json({
  //           success: false,
  //           message: "upload a instagram token before you schedule a post",
  //         });
  //       } else {
  //         if (data.image) {
  //           cloudinary.pics_upload(data.image.image.data).then((file_data) => {
  //             data.image = file_data.secure_url;
  //             IgPostModel.create(data, (err, post) => {
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
  //           IgPostModel.create(data, (err, post) => {
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
  //     IgPostModel.findByIdAndUpdate(id, data, (err) => {
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
  //     IgPostModel.findByIdAndRemove(id, (err) => {
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
  //     IgPostModel.find({}, (err, post) => {
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
module.exports = new IgController();
