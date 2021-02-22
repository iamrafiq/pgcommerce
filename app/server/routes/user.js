
const express = require("express");
const router = express.Router();
const {
  userByUUID,
  read,
  update
} = require("../controllers/user");
const { requireSignin, isAuth, isAdmin, isSuperAdmin } = require("../controllers/auth");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);

router.param("userId", userByUUID);

module.exports = router;