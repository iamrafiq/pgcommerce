const express = require("express");
const router = express.Router();
const {
  create,
  brandByUUID,
  translationByUUID,
  brandBySlug,
  read,
  softRemove,
  hardRemove,
  reactivate,
  reactivateTranslation,
  hardRemoveTranslation,
  update,
  list,
  listWithAllTranslation,
} = require("../controllers/brand");
const {storeFiles} = require("../controllers/file")
const {responce} = require("../controllers/responce")
const { authenticate ,verifyToken, requireSignin, isAuth, isBlocked, isAdmin, isSuperAdmin, isClerk} = require('../controllers/auth');
const {userByUUID} = require("../controllers/user")


//private api
router.post("/brand/create/", verifyToken, authenticate, userByUUID, create, storeFiles, responce);
router.put("/brand/:brandUUID/", verifyToken, authenticate, userByUUID, update, storeFiles, responce);
router.put("/brand/reactivate/:brandUUID/", verifyToken, authenticate, userByUUID, reactivate, responce);
router.put("/brand/translation/reactivate/:translationUUID/", verifyToken, authenticate, userByUUID, reactivateTranslation, responce);

router.delete("/brand/soft/:brandUUID/",  verifyToken, authenticate, userByUUID, softRemove, responce);
router.delete("/brand/hard/:brandUUID/",  verifyToken, authenticate, userByUUID, hardRemove, responce);
router.delete("/brand/translation/hard/:translationUUID/",verifyToken, authenticate, userByUUID, hardRemoveTranslation, responce);
router.get("/brands/:userUUID", verifyToken, authenticate, userByUUID, listWithAllTranslation, responce);

//public api
router.get("/public/brand/:brandUUID", read);
router.get("/public/brand/by/slug/:slug", read);
router.get("/public/brands/", list, responce);

//middleware
router.param("slug", brandBySlug);
router.param("brandUUID", brandByUUID);
router.param("translationUUID", translationByUUID);

module.exports = router;

