const express = require("express");
const router = express.Router();
const {
  create,
  categoryByUUID,
  translationByUUID,
  categoryBySlug,
  read,
  softRemove,
  hardRemove,
  reactivate,
  reactivateTranslation,
  hardRemoveTranslation,
  update,
  list,
  listWithAllTranslation,
} = require("../controllers/category");
const {storeFiles} = require("../controllers/file")
const {responce} = require("../controllers/responce")
const { verifyToken, requireSignin, isAuth, isBlocked, isAdmin, isSuperAdmin, isClerk} = require('../controllers/auth');
const {userByUUID} = require("../controllers/user")


//private api
 router.post("/category/create/", verifyToken, create, storeFiles, responce);
router.put("/category/:categoryUUID/:userUUID", requireSignin, isAuth, isBlocked, isClerk, update, storeFiles, responce);
router.put("/category/reactivate/:categoryUUID/:userUUID", requireSignin, isAuth, isBlocked, isAdmin, reactivate, responce);
router.put("/category/translation/reactivate/:translationUUID/:userUUID", requireSignin, isAuth, isBlocked, isAdmin, reactivateTranslation, responce);

router.delete("/category/soft/:categoryUUID/:userUUID",  requireSignin, isAuth, isBlocked, isAdmin, softRemove, responce);
router.delete("/category/hard/:categoryUUID/:userUUID",  requireSignin, isAuth, isBlocked, isSuperAdmin, hardRemove, responce);
router.delete("/category/translation/hard/:translationUUID/:userUUID", requireSignin, isAuth, isBlocked, isSuperAdmin, hardRemoveTranslation, responce);
router.get("/categories/:userUUID", requireSignin, isAuth, isBlocked, isClerk, listWithAllTranslation, responce);

//public api
router.get("/public/category/:categoryUUID", read);
router.get("/public/category/by/slug/:slug", read);
router.get("/public/categories/", list, responce);

//middleware
router.param("slug", categoryBySlug);
router.param("categoryUUID", categoryByUUID);
router.param("translationUUID", translationByUUID);
router.param("userUUID", userByUUID);

module.exports = router;
