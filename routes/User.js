const {CreateUser, LoginUser} = require("../controllers/user.js");
const express = require("express");
const router = express.Router();

router.post("/user/create", CreateUser); // create new admin
router.post("/user", LoginUser); // login admin


module.exports = router;