const express = require("express");
const { authUser, registerUser } = require("../controllers/userControllers.js");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);

module.exports = router;  