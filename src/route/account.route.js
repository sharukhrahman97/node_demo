require('dotenv').config()
const express = require("express");
const router = express.Router();
const jwt = require("../middleware/jwt.middleware");
const { createAccount, readAccount, readAllAccounts, updateAccount, deleteAccount } = require('../controller/account.controller');

router.post("/createAccount", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), createAccount);
router.post("/readAccount", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), readAccount);
router.post("/readAllAccounts", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), readAllAccounts);
router.post("/updateAccount", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), updateAccount);
router.post("/deleteAccount", (process.env.MODE !== 1) ? jwt.verifyTokens : (req, res, next) => next(), deleteAccount);
