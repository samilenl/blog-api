const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentController");
const topicController = require("../controllers/topicController");

const passport = require("passport");

const upload = require("../configs/multer")
// // console.log(uploa)





const onlyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next()
    }
    else {
        res.status(403).json({message: "Only admins can access this route"})
    }
}





// POSTS

// get recent posts
router.get(
    "/posts/recent",
    // passport.authenticate("jwt", { session: false }),
    postController.recent_posts
);
// get a particular post
router.get( "/posts/:id", postController.post_get );

// POST OPERATIONS FOR ADMIN

router.get("/images/:id", postController.image_get)

router.get(
    "/posts-admin",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    postController.all_posts
);

router.get(
    "/posts",
    // passport.authenticate("jwt", { session: false }),
    postController.public_posts
);



router.post(
    "/posts/create",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    upload.single("image"),
    postController.post_create
);

router.put(
    "/posts/:id",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    upload.single("image"),
    postController.post_update
);

router.delete(
    "/posts/:id",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    postController.post_delete
);









// COMMENTS

// create a new comment
router.post(
    "/comments/:postID/create",
    passport.authenticate("jwt", { session: false }),
    commentController.comment_create
);

// COMMENT OPERATIONS FOR ADMIN

router.get(
    "/posts/:id/comments",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    commentController.comment_get
);

router.put(
    "/comments/:id",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    commentController.comment_update
);

router.delete(
    "/comments/:id",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    commentController.comment_delete
);










// TOPICS

// get a list of all topics
router.get("/topics", topicController.all_topics);

// get a particular topic
router.get( "/topics/:id", topicController.topic_get );


// TOPIC OPERATIONS FOR ADMIN

router.post(
    "/topics/create",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    topicController.topic_create
);

router.put(
    "/topics/:id",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    topicController.topic_update
);

router.delete(
    "/topics/:id",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    topicController.topic_delete
);












// USERS

// create a new user (and login the user)
router.post("/register", userController.user_create);

// login a user
router.post("/login", userController.user_login);

// login an admin
router.post("/login-admin", userController.admin_login);

// checks if a user is logged in
router.get(
    "/check-auth", 
    passport.authenticate("jwt", { session: false }),
    userController.user_auth
)

// USER OPERATIONS FOR ADMIN

router.get(
    "/users",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    userController.all_users
);

router.get(
    "/users/:id",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    userController.user_get
);

router.put(
    "/users/:id",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    userController.user_update
);

router.delete(
    "/users/:id",
    passport.authenticate("jwt", { session: false }),
    onlyAdmin,
    userController.user_delete
);



module.exports = router;