var express = require('express');
var router = express.Router();
const Post = require('../models/post.model')
const { ensureLoggedIn } = require('../utils/middlewares')

const { createPost,uncreatePost,updatePost,deleteSchedule,updateSchedule,
    getPost,
    rando,
    likePost,
    unlikePost,
    repostPost,
    unrepostPost,
    getLikes,
    getReposts,
    replyToPost,
    getReplies
} = require('../controllers/post.controller')
const { getUser, followUser, unFollowUser, updateUser, linkUserAccounts, getFollowers, getFriends } = require('../controllers/user.controller')
const { homeTimeline, userTimeline, userScheduled, userScheduledOneDay } = require('../controllers/timeline.controller')
const { search, trends, userSuggests } = require('../controllers/search.controller')
const { notificationRead, getNotifications, subscribeDevice, unsubscribeDevice } = require('../controllers/notifications.controller')
const fbController = require("../controllers/fbController");
const twController = require("../controllers/twController");
const igController = require("../controllers/igController");



/* GET notification read*/
router.get('/notification_read/', ensureLoggedIn, notificationRead)

// router.get('/notification_read/:_id', ensureLoggedIn, notificationRead)
/* GET all notifications */
router.get('/notifications', ensureLoggedIn, getNotifications)
/* push subscribe, unsubscribe */
router.post('/notifications/subscribe', ensureLoggedIn, subscribeDevice);
router.get('/notifications/unsubscribe', ensureLoggedIn, unsubscribeDevice);

/* GET home page. */
router.get('/home_timeline', ensureLoggedIn, homeTimeline);
/* GET user timeline */
router.get('/user_timeline/:username', userTimeline)
/* GET user Scheduled posts */
router.get('/user_scheduled/:username', ensureLoggedIn, userScheduled)
/* GET user Scheduled posts on one specific date */
router.get('/user_scheduled/:username/:date', ensureLoggedIn, userScheduledOneDay)
/* GET user friends and followers */
router.get('/followers/:username', getFollowers)
router.get('/friends/:username', getFriends)
/* POST post a reply */
router.post('/post/:postId/reply', ensureLoggedIn, replyToPost)

/* GET Post liked_by and reposted_by */
router.get('/post/:postId/likes', getLikes);
router.get('/post/:postId/reposts', getReposts);

/* GET Post replies */
router.get('/post/:postId/replies', getReplies);

/* POST create new post. */
router.post('/post', ensureLoggedIn, createPost);
/* Post delete post */
router.post('/unpost', ensureLoggedIn, uncreatePost);
router.post('/unschedule', ensureLoggedIn, deleteSchedule);
/* POST update post. */
router.post('/post/:postId/update', ensureLoggedIn, updatePost);
/* POST update post schedule. */
router.post('/reschedule/:postId', ensureLoggedIn, updateSchedule);

/* POST repost a post. */
router.post('/repost', ensureLoggedIn, repostPost);
/* POST unrepost a post. */
router.post('/unrepost', ensureLoggedIn, unrepostPost);
/* GET get a single post. */
router.get('/post/:postId', getPost);
router.all('/like/:postId', ensureLoggedIn, likePost);
router.all('/unlike/:postId', ensureLoggedIn, unlikePost);


/* GET get a single user detail. */
router.get('/user/:username', getUser);
router.all('/follow/:username', ensureLoggedIn, followUser);
router.all('/unfollow/:username', ensureLoggedIn, unFollowUser);
/* POST update authenticated user */
router.post('/updateuser', ensureLoggedIn, updateUser);
// router.post('/linkaccounts', ensureLoggedIn, linkUserAccounts);
/* POST update on linked socials */
router.post('/tw/update', ensureLoggedIn, twController.updateAcc);
router.post('/fb/update', ensureLoggedIn, fbController.updateAcc);
router.post('/ig/update', ensureLoggedIn, igController.updateAcc);
// router.get('/:username', igController.findTest);




/* GET seach results */
router.get('/search', search)
/* GET trends. */
router.get('/trends', trends)
/* GET user Suggestions */
router.get('/users', ensureLoggedIn, userSuggests)

module.exports = router;