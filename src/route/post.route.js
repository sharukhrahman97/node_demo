const express = require("express");
const { verifyTokens } = require("../middleware/jwt.middleware");
const { createPost, readPost, readAllPosts, readAllDrafts, updatePostStatus, updatePostViewCount, deletePost } = require('../controller/post.controller');
const { createPostValidator, readPostValidator, readAllPostsValidator, updatePostStatusValidator, updatePostViewCountValidator, deletePostValidator } = require('../helper/validate.helper');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

router.post("/createPost", verifyTokens, createPostValidator(), validate, createPost);
router.get("/readPost/:id", readPostValidator(), validate, readPost);
router.get("/readAllPosts", readAllPostsValidator(), validate, readAllPosts);
router.post("/readAllDrafts", verifyTokens, readAllDrafts);
router.put("/updatePostStatus", verifyTokens, updatePostStatusValidator(), validate, updatePostStatus);
router.put("/updatePostViewCount", verifyTokens, updatePostViewCountValidator(), validate, updatePostViewCount);
router.delete("/deletePost", verifyTokens, deletePostValidator(), validate, deletePost);

module.exports = router;
