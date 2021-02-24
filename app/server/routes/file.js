const express = require("express");
const router = express.Router();
const { files, storeFiles, send, list } = require("../controllers/file");
const { responce } = require("../controllers/responce");
const {
  authenticate ,verifyToken,
  requireSignin,
  isAuth,
  isBlocked,
  isAdmin,
  isSuperAdmin,
  isClerk,
} = require("../controllers/auth");
const { userByUUID } = require("../controllers/user");

//private api
router.post(
  "/files/upload/:userUUID",
  requireSignin,
  isAuth,
  isBlocked,
  isClerk,
  files,
  storeFiles,
  send
);
router.get(
  "/files/:userUUID",
  requireSignin,
  isAuth,
  isBlocked,
  isClerk,
  list,
  responce
);

router.param("userUUID", userByUUID);

module.exports = router;
