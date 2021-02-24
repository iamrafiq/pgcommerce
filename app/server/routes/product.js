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
const {verifyToken, authenticate, requireSignin, isAuth, isBlocked, isAdmin, isSuperAdmin, isClerk} = require('../controllers/auth');
const {userByUUID} = require("../controllers/user")


//private api
router.post("/product/create/",verifyToken, authenticate, userByUUID, create, storeFiles, responce);
router.put("/product/:productUUID/" ,verifyToken, authenticate, userByUUID,  update, storeFiles, responce);
router.put("/product/reactivate/:productUUID/" ,verifyToken, authenticate, userByUUID, reactivate, responce);
router.put("/product/translation/reactivate/:translationUUID/" ,verifyToken, authenticate, userByUUID, reactivateTranslation, responce);

router.delete("/product/soft/:productUUID/" ,verifyToken, authenticate, userByUUID, softRemove, responce);
router.delete("/product/hard/:productUUID/" ,verifyToken, authenticate, userByUUID, hardRemove, responce);
router.delete("/product/translation/hard/:translationUUID/", authenticate ,verifyToken, userByUUID, hardRemoveTranslation, responce);
router.get("/products/",verifyToken, authenticate, userByUUID, listWithAllTranslation, responce);

//public api
router.get("/public/product/:productUUID", read);
router.get("/public/product/by/slug/:slug", read);
router.get("/public/products/", list, responce);

//middleware
router.param("slug", productBySlug);
router.param("productUUID", productByUUID);
router.param("translationUUID", translationByUUID);

module.exports = router;
