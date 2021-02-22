const express = require("express");
const router = express.Router();
const {
  create,
  clusterByUUID,
  translationByUUID,
  clusterBySlug,
  read,
  softRemove,
  hardRemove,
  reactivate,
  reactivateTranslation,
  hardRemoveTranslation,
  update,
  list,
  listWithAllTranslation,
} = require("../controllers/cluster");
const {storeFiles} = require("../controllers/file")
const {responce} = require("../controllers/responce")
const { requireSignin, isAuth, isBlocked, isAdmin, isSuperAdmin, isClerk} = require('../controllers/auth');
const {userByUUID} = require("../controllers/user")


//private api
router.post("/cluster/create/:userUUID", requireSignin, isAuth, isBlocked, isClerk, create, storeFiles, responce);
router.put("/cluster/:clusterUUID/:userUUID", requireSignin, isAuth, isBlocked, isClerk, update, storeFiles, responce);
router.put("/cluster/reactivate/:clusterUUID/:userUUID", requireSignin, isAuth, isBlocked, isAdmin, reactivate, responce);
router.put("/cluster/translation/reactivate/:translationUUID/:userUUID", requireSignin, isAuth, isBlocked, isAdmin, reactivateTranslation, responce);

router.delete("/cluster/soft/:clusterUUID/:userUUID",  requireSignin, isAuth, isBlocked, isAdmin, softRemove, responce);
router.delete("/cluster/hard/:clusterUUID/:userUUID",  requireSignin, isAuth, isBlocked, isSuperAdmin, hardRemove, responce);
router.delete("/cluster/translation/hard/:translationUUID/:userUUID", requireSignin, isAuth, isBlocked, isSuperAdmin, hardRemoveTranslation, responce);
router.get("/clusters/:userUUID", requireSignin, isAuth, isBlocked, isClerk, listWithAllTranslation, responce);

//public api
router.get("/public/cluster/:clusterUUID", read);
router.get("/public/cluster/by/slug/:slug", read);
router.get("/public/clusters/", list, responce);

//middleware
router.param("slug", clusterBySlug);
router.param("clusterUUID", clusterByUUID);
router.param("translationUUID", translationByUUID);
router.param("userUUID", userByUUID);

module.exports = router;