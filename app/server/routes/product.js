const express = require("express");
const router = express.Router();
const {
  create,
  productByUUID,
  translationByUUID,
  productBySlug,
  read,
  softRemove,
  hardRemove,
  reactivate,
  reactivateTranslation,
  hardRemoveTranslation,
  update,
  list,
  listWithAllTranslation,
} = require("../controllers/product");
const {storeFiles} = require("../controllers/file")
const {responce} = require("../controllers/responce")
const { requireSignin, isAuth, isBlocked, isAdmin, isSuperAdmin, isClerk} = require('../controllers/auth');
const {userByUUID} = require("../controllers/user")


//private api
router.post("/product/create/:userUUID", requireSignin, isAuth, isBlocked, isClerk, create, storeFiles, responce);
router.put("/product/:productUUID/:userUUID", requireSignin, isAuth, isBlocked, isClerk, update, storeFiles, responce);
router.put("/product/reactivate/:productUUID/:userUUID", requireSignin, isAuth, isBlocked, isAdmin, reactivate, responce);
router.put("/product/translation/reactivate/:translationUUID/:userUUID", requireSignin, isAuth, isBlocked, isAdmin, reactivateTranslation, responce);

router.delete("/product/soft/:productUUID/:userUUID",  requireSignin, isAuth, isBlocked, isAdmin, softRemove, responce);
router.delete("/product/hard/:productUUID/:userUUID",  requireSignin, isAuth, isBlocked, isSuperAdmin, hardRemove, responce);
router.delete("/product/translation/hard/:translationUUID/:userUUID", requireSignin, isAuth, isBlocked, isSuperAdmin, hardRemoveTranslation, responce);
router.get("/products/:userUUID", requireSignin, isAuth, isBlocked, isClerk, listWithAllTranslation, responce);

//public api
router.get("/public/product/:productUUID", read);
router.get("/public/product/by/slug/:slug", read);
router.get("/public/products/", list, responce);

//middleware
router.param("slug", productBySlug);
router.param("productUUID", productByUUID);
router.param("translationUUID", translationByUUID);
router.param("userUUID", userByUUID);

module.exports = router;
