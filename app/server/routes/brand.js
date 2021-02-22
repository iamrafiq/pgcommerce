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
const { requireSignin, isAuth, isBlocked, isAdmin, isSuperAdmin, isClerk} = require('../controllers/auth');
const {userByUUID} = require("../controllers/user")


//private api
router.post("/brand/create/:userUUID", requireSignin, isAuth, isBlocked, isClerk, create, storeFiles, responce);
router.put("/brand/:brandUUID/:userUUID", requireSignin, isAuth, isBlocked, isClerk, update, storeFiles, responce);
router.put("/brand/reactivate/:brandUUID/:userUUID", requireSignin, isAuth, isBlocked, isAdmin, reactivate, responce);
router.put("/brand/translation/reactivate/:translationUUID/:userUUID", requireSignin, isAuth, isBlocked, isAdmin, reactivateTranslation, responce);

router.delete("/brand/soft/:brandUUID/:userUUID",  requireSignin, isAuth, isBlocked, isAdmin, softRemove, responce);
router.delete("/brand/hard/:brandUUID/:userUUID",  requireSignin, isAuth, isBlocked, isSuperAdmin, hardRemove, responce);
router.delete("/brand/translation/hard/:translationUUID/:userUUID", requireSignin, isAuth, isBlocked, isSuperAdmin, hardRemoveTranslation, responce);
router.get("/brands/:userUUID", requireSignin, isAuth, isBlocked, isClerk, listWithAllTranslation, responce);

//public api
router.get("/public/brand/:brandUUID", read);
router.get("/public/brand/by/slug/:slug", read);
router.get("/public/brands/", list, responce);

//middleware
router.param("slug", brandBySlug);
router.param("brandUUID", brandByUUID);
router.param("translationUUID", translationByUUID);
router.param("userUUID", userByUUID);

module.exports = router;

