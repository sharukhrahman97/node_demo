const express = require("express");
const { verifyTokens } = require("../middleware/jwt.middleware");
const { createAccount, readAccount, readAllAccounts, updateAccount, deleteAccount, loginAccount } = require('../controller/account.controller');
const { validate } = require('../middleware/validate.middleware');
const { loginValidator, createAccountValidator, readAccountValidator, updateAccountValidator } = require('../helper/validate.helper');

const router = express.Router();

router.post("/loginAccount", loginValidator(), validate, loginAccount);
router.post("/createAccount", createAccountValidator(), validate, createAccount);
router.get("/readAccount", readAccountValidator(), validate, readAccount);
router.get("/readAllAccounts", readAllAccounts);
router.put("/updateAccount", verifyTokens, updateAccountValidator(), validate, updateAccount);
router.delete("/deleteAccount", verifyTokens, deleteAccount);

module.exports = router;
