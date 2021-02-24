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
const { authenticate ,verifyToken, requireSignin, isAuth, isBlocked, isAdmin, isSuperAdmin, isClerk} = require('../controllers/auth');
const {userByUUID} = require("../controllers/user")


//private api
router.post("/cluster/create/", verifyToken, authenticate, userByUUID, create, storeFiles, responce);
router.put("/cluster/:clusterUUID/",verifyToken, authenticate, userByUUID, update, storeFiles, responce);
router.put("/cluster/reactivate/:clusterUUID/",verifyToken, authenticate, userByUUID, reactivate, responce);
router.put("/cluster/translation/reactivate/:translationUUID/",verifyToken, authenticate, userByUUID, reactivateTranslation, responce);

router.delete("/cluster/soft/:clusterUUID/", verifyToken, authenticate, userByUUID, softRemove, responce);
router.delete("/cluster/hard/:clusterUUID/", verifyToken, authenticate, userByUUID, hardRemove, responce);
router.delete("/cluster/translation/hard/:translationUUID/",verifyToken, authenticate, userByUUID, hardRemoveTranslation, responce);
router.get("/clusters/:userUUID", verifyToken, authenticate, userByUUID, listWithAllTranslation, responce);

//public api
router.get("/public/cluster/:clusterUUID", read);
router.get("/public/cluster/by/slug/:slug", read);
router.get("/public/clusters/", list, responce);

//middleware
router.param("slug", clusterBySlug);
router.param("clusterUUID", clusterByUUID);
router.param("translationUUID", translationByUUID);

module.exports = router;