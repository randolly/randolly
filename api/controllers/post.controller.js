const Post = require("../models/post.model");
const SCPost = require("../models/scPost.model");
const PostEngagement = require("../models/post_engagement.model");
const Friendship = require("../models/friendship.model");
const {
  serializePost,
  serializePosts,
} = require("../serializers/post.serializer");
const { serializeUsers } = require("../serializers/user.serializer");
const assert = require("assert");
const { filterInput } = require("../utils/helpers");
// const cloudinary = require("../lib/cloud");
const Notification = require("../models/notification.model");
// const EachNotification = require("../models/notification.model");

exports.createPost = async (req, res, next) => {
  try {
    let post = req.body;

    // check if post is scheduled then post normally else post to SC(scheduled post which will go through cron job)
    if (req.body.schedule == null) {
      let { text, image, socials, ...rest } = post;
      text = filterInput(text, "html", { max_length: 500, identifier: "Post" });
      let cross_post_options = socials;
      post = {
        text,
        image,
        cross_post_options,
        ...rest,
      };
      console.log(post);
      let user = req.user;
      // console.log(user)
      await Post.addOne({ user_id: user._id }, post);
      res.json({
        message: "Successfully posted",
      });
    } else {
      let { text, image, schedule, timeZone, socials, ...rest } = post;
      text = filterInput(text, "html", { max_length: 500, identifier: "Post" });
      let posted = false;
      function getCurrentDate(d) {
        const t = new Date(d);
        const date = ("0" + t.getDate()).slice(-2);
        const month = ("0" + (t.getMonth() + 1)).slice(-2);
        const year = t.getFullYear();
        return `${date}-${month}-${year}`;
      }
      let yymmdd = getCurrentDate(schedule);
      let cross_post_options = socials;
      post = {
        text,
        image,
        schedule,
        timeZone,
        yymmdd,
        posted,
        cross_post_options,
        ...rest,
      };
      console.log(post);
      let user = req.user;
      // console.log(user)
      await SCPost.addOne({ user_id: user._id }, post);
      res.json({
        message: "Successfully scheduled",
      });
    }
  } catch (err) {
    next(err);
  }
};
exports.updatePost = async (req, res, next) => {
  try {
    let user = req.user;
    // let post = req.body;
    let post = req.body;
    console.log(post);
    const postId = req.params.postId;
    let { text, ...rest } = post;
    assert.ok(user);
    // let { text } = req.body
    text = filterInput(text, "html", { max_length: 500, identifier: "Post" });
    // let body = {
    //     text: text,
    // }
    if (user._id == post.userID) {
      // update post
      Post.findByIdAndUpdate(post.postID, { text: text }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Post : ", docs);
        }
      });
    } else {
      console.log("you dont have permission to update this post");
    }
  } catch (err) {
    next(err);
  }
};
exports.uncreatePost = async (req, res, next) => {
  try {
    let post = req.body;
    let user = req.user;
    assert.ok(user);

    // await Friendship.postUnreposted(user._id, { post_id: post._id });
    // console.log("post", post._id)
    // console.log("user", user)

    if (user._id == post.user._id) {
      // unlike post
      // get all people that liked then tell them to unlike
      // unrepost post
      // get all people that reposted then tell them to unrepost
      // any notification related to the post id we want it gone
      // delete post

      await PostEngagement.findOne({ post_id: post._id }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          if (docs) {
            let usersLiked = docs.liked_by;
            if (usersLiked) {
              for (let e of usersLiked) {
                console.log(e);
                Friendship.postUnliked(e, { post_id: post._id });
              }
            }
            let usersReposted = docs.reposted_by;
            if (usersReposted) {
              for (let e of usersReposted) {
                console.log(e);
                Friendship.postUnreposted(e, { post_id: post._id });
              }
            }
          } else {
            console.log("no docs of post engagement");
          }
        }
      });
      let doc23 = await Notification.findOne(
        { user_id: user._id },
        "notifications"
      );
      if (doc23) {
        // console.log(doc23);
        let notifications1 = doc23.notifications;
        for (let e of notifications1) {
          // console.log(e.body.post)
          if (e.body.post == post._id) {
            console.log("found");
            console.log(e._id);
            // await EachNotification.findOneAndDelete({ _id: e._id }, function (err, docs) {
            //   if (err) {
            //     console.log(err);
            //   } else {
            //     console.log("Deleted Post : ", docs);
            //   }
            // });
            // theres a bug its supposed to delete one
            await Notification.updateOne(
              {
                "notifications._id": e._id,
              },
              {
                $pull: {
                  notifications: { _id: e._id },
                },
              }
            );
          }
        }
      }
      Post.findOneAndDelete({ _id: post._id }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Deleted Post : ", docs);
        }
      });
    } else {
      console.log("you dont have permission to delete this post");
    }

    res.json({
      message: "Succesfully deleted",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    let user = req.user;
    // let post = req.body;
    let post = req.body;
    console.log(post);
    const postId = req.params.postId;
    let { text, ...rest } = post;
    assert.ok(user);
    // let { text } = req.body
    text = filterInput(text, "html", { max_length: 500, identifier: "Post" });
    // let body = {
    //     text: text,
    // }
    if (user._id == post.userID) {
      // update post
      SCPost.findByIdAndUpdate(
        post.postID,
        { text: text },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Post : ", docs);
          }
        }
      );
    } else {
      console.log("you dont have permission to update this post");
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    let post = req.body;
    let user = req.user;
    assert.ok(user);

    // await Friendship.postUnreposted(user._id, { post_id: post._id });
    // console.log("post", post._id)
    // console.log("user", user)

    if (user._id == post.user._id) {
      SCPost.findOneAndDelete({ _id: post._id }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Deleted Post : ", docs);
        }
      });
    } else {
      console.log("you dont have permission to delete this post");
    }

    res.json({
      message: "Succesfully deleted",
    });
  } catch (err) {
    next(err);
  }
};
exports.getPost = async (req, res, next) => {
  try {
    let postId = req.params.postId;
    let post = await Post.findOne({ id_str: postId });
    if (!post) {
      res.status(400).json({ msg: "Bad request" });
      return;
    }
    post = await serializePost(post, req.user);
    res.status(200).json({
      post,
    });
  } catch (err) {
    next(err);
  }
};
exports.likePost = async (req, res, next) => {
  try {
    let postId = req.params.postId;
    let user = req.user;
    let responce = await Friendship.postLiked(user._id, { postId });
    if (responce.ok) res.json({ message: "Post was liked" });
    else throw Error("Error in like post");
  } catch (err) {
    next(err);
  }
};
exports.unlikePost = async (req, res, next) => {
  try {
    let postId = req.params.postId;
    let user = req.user;
    let responce = await Friendship.postUnliked(user._id, { postId });
    if (responce.ok) res.json({ message: "Post was unliked" });
    else throw Error("Error in unlike post");
  } catch (err) {
    next(err);
  }
};
exports.repostPost = async (req, res, next) => {
  try {
    let post = req.body;
    let { text, ...rest } = post;
    text = filterInput(text, "html", { max_length: 500, identifier: "Post" });
    post = {
      text,
      ...rest,
    };
    let form = {
      text: `RT @${post.user.screen_name}: ${post.text.slice(0, 50)}`,
      retweeted_status: post._id,
    };
    let user = req.user;
    await Post.addOne({ user_id: user._id }, form);
    await Friendship.postReposted(user._id, { postId: post.id_str });
    res.json({
      message: "Successfully reposted",
    });
  } catch (err) {
    next(err);
  }
};
exports.unrepostPost = async (req, res, next) => {
  try {
    let post = req.body;
    let user = req.user;
    assert.ok(user);
    let doc = await Post.findOne({ retweeted_status: post._id });
    await doc.deleteOne();
    await Friendship.postUnreposted(user._id, { post_id: post._id });
    res.json({
      message: "Succesfully Unreposted",
    });
  } catch (err) {
    next(err);
  }
};
exports.getLikes = async (req, res, next) => {
  try {
    let { postId } = req.params;
    let p = req.query["p"];
    p = parseInt(p); //page/batch number
    const s = 15; //size of page/batch

    const post = await Post.findOne({ id_str: postId }, "_id");
    if (!post) return res.status(400).json({ msg: "Bad request" });

    let doc = await PostEngagement.findOne(
      { post_id: post._id },
      {
        liked_by: {
          $slice: [s * (p - 1), s],
        },
      }
    ).populate("liked_by");
    if (!doc) return res.json({ users: null });
    let users = await serializeUsers(doc.liked_by, req.user);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};
exports.getReposts = async (req, res, next) => {
  try {
    let { postId } = req.params;
    let p = req.query["p"];
    p = parseInt(p); //page/batch number
    const s = 15; //size of page/batch

    const post = await Post.findOne({ id_str: postId }, "_id");
    if (!post) return res.status(400).json({ msg: "Bad request" });

    let doc = await PostEngagement.findOne(
      { post_id: post._id },
      {
        reposted_by: {
          $slice: [s * (p - 1), s],
        },
      }
    ).populate("reposted_by");
    if (!doc) return res.json({ users: null });
    let users = await serializeUsers(doc.reposted_by, req.user);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};
exports.getReplies = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    let p = req.query["p"];
    p = parseInt(p); //page/batch number
    const s = 15; //size of page/batch

    const post = await Post.findOne({ id_str: postId });
    if (!post) return res.status(400).json({ msg: "Bad request" });

    const doc = await PostEngagement.findOne(
      { post_id: post._id },
      {
        reply_posts: {
          $slice: [s * (p - 1), s],
        },
      }
    ).populate("reply_posts");
    if (!doc) return res.json({ posts: null });
    const posts = await serializePosts(doc.reply_posts, req.user);
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.replyToPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const user = req.user;
    let post = req.body;
    let { text, ...rest } = post;
    text = filterInput(text, "html", { max_length: 500, identifier: "Post" });
    post = {
      text,
      ...rest,
    };

    const targetPost = await Post.findOne({ id_str: postId }).populate("user");
    if (!targetPost) return res.status(400).json({ msg: "Bad request" });

    let form = {
      ...post,
      in_reply_to_status_id: targetPost.id,
      in_reply_to_status_id_str: targetPost.id_str, //would be string anyway
      in_reply_to_user_id: targetPost.user.id,
      in_reply_to_user_id_str: targetPost.user.id_str,
      in_reply_to_screen_name: targetPost.user.screen_name,
      quoted_status: targetPost._id, //just for UI to look good
      is_quote_status: false, //maybe use this to distinguish
    };
    post = await Post.addOne({ user_id: user._id }, form);
    if (post) {
      //no error proceed
      await PostEngagement.gotReplied(targetPost._id, post._id);
      post = await serializePost(post, req.user);
      res.json({ msg: "Ok", post });
    } else throw new Error("Post. responce not ok");
  } catch (err) {
    next(err);
  }
};
exports.rando = async (req, res, next) => {
  Post.findRandom()
    .then((post) => res.json(post))
    .catch((err) => console.log(err));
  // try {
  // let postId = req.params.postId;
  // let post = await Post.findRandom()
  // .then(post => res.json(post))
  // .catch(err => console.log(err))
  // if (!post) {
  //     res.status(400).json({ msg: "Bad request" })
  //     return
  // }
  // post = await serializePost(post, req.user)
  // res.status(200).json({
  //     post
  // });
  // } catch (err) { next(err) }
};
