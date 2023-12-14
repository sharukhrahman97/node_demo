require('dotenv').config()
const express = require("express");
const router = express.Router();
const jwt = require("../middleware/jwt.middleware");
const { createPost, readPost, readAllPosts, readAllDrafts, updatePostStatus, updatePostViewCount, deletePost, deleteAllPost } = require('../controller/post.controller');

router.post("/createPost", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), createPost);
router.post("/readPost", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), readPost);
router.post("/readAllPosts", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), readAllPosts);
router.post("/readAllDrafts", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), readAllDrafts);
router.post("/updatePostStatus", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), updatePostStatus);
router.post("/updatePostViewCount", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), updatePostViewCount);
router.post("/deletePost", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), deletePost);
router.post("/deleteAllPost", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), deleteAllPost);