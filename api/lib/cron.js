const cron = require("node-cron");
const Post = require("../models/post.model");
const postSchema = require("../models/scPost.model");
const timeZone = require("timezone-support");

class Cron {
  run() {
    //run every minute
    cron.schedule("* * * * *", () => {
      console.log(
        "running every minute, Reprezents randos 💓, we shall live forever"
      );
      // get all post that are supposed to be Deleted and have been posted
      postSchema.deleteMany({ posted: true });
      // get all post that is supposed to be scheduled🥳
      postSchema.find({ posted: false }, async (err, post) => {
        for (let obj of post) {
          const place = timeZone.findTimeZone(obj.timeZone);
          const scheduledTime = timeZone.getZonedTime(
            new Date(obj.schedule),
            place
          );
          const myTime = timeZone.getZonedTime(new Date(), place);
// below is buggy because some serious maths is needed
          if (
            scheduledTime.year === myTime.year &&
            scheduledTime.month === myTime.month &&
            scheduledTime.day <= myTime.day &&
            scheduledTime.dayOfWeek <= myTime.dayOfWeek &&
            myTime.hours <= scheduledTime.hours &&
            myTime.minutes === scheduledTime.minutes &&
            myTime.seconds >= scheduledTime.seconds &&
            myTime.milliseconds >= scheduledTime.milliseconds
          ) {
            
            let post1 = obj
            let { text, image, cross_post_options, ...rest } = post1;
            post1 = {
              text,
              image,
              cross_post_options,
              ...rest,
            };
            await Post.addOne({ user_id: obj.user }, post1);
            await postSchema.findByIdAndUpdate(obj._id, { posted: true });
            console.log("success");
            
          }
        }
      });
      
    });
  }
}
module.exports = new Cron();
