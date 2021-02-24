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
const { authenticate ,verifyToken, requireSignin, isAuth, isBlocked, isAdmin, isSuperAdmin, isClerk} = require('../controllers/auth');
const {userByUUID} = require("../controllers/user")


//private api
router.post("/category/create/",verifyToken, authenticate, userByUUID, create, storeFiles, responce);
router.put("/category/:categoryUUID/",verifyToken, authenticate, userByUUID, update, storeFiles, responce);
router.put("/category/reactivate/:categoryUUID/",verifyToken, authenticate, userByUUID, reactivate, responce);
router.put("/category/translation/reactivate/:translationUUID/",verifyToken, authenticate, userByUUID, reactivateTranslation, responce);

router.delete("/category/soft/:categoryUUID/", verifyToken, authenticate, userByUUID, softRemove, responce);
router.delete("/category/hard/:categoryUUID/", verifyToken, authenticate, userByUUID, hardRemove, responce);
router.delete("/category/translation/hard/:translationUUID/",verifyToken, authenticate, userByUUID, hardRemoveTranslation, responce);
router.get("/categories/:userUUID",verifyToken, authenticate, userByUUID, listWithAllTranslation, responce);

//public api
router.get("/public/category/:categoryUUID", read);
router.get("/public/category/by/slug/:slug", read);
router.get("/public/categories/", list, responce);

//middleware
router.param("slug", categoryBySlug);
router.param("categoryUUID", categoryByUUID);
router.param("translationUUID", translationByUUID);

module.exports = router;
