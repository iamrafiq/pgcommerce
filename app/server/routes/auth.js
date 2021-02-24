
const express = require('express');
const router = express.Router();
const {authenticate ,verifyToken} = require('../controllers/auth');
const {changePasswordCondition, authValidator} = require('../validator/index');
const {storeFiles} = require("../controllers/file")
const {responce} = require("../controllers/responce")
const {userByUUID} = require("../controllers/user")

//public api 
router.post('/authenticate',verifyToken, authenticate,responce);

// router.post('/signup', signup,responce);
// router.post('/signin', verifyToken, signin, responce);
// router.get('/signout', signout);

//private api
// router.put('/change/password/:userUUID', requireSignin, isAuth, isBlocked, isAdmin, changePasswordCondition, authValidator, changePassword, responce);
// router.put('/alter/role/:userUUID', requireSignin, isAuth, isBlocked, isAdmin, authValidator, alterRole, responce);
// router.put('/alter/block/:userUUID', requireSignin, isAuth, isBlocked, isAdmin, authValidator, alterBlock, responce);


router.param("userUUID", userByUUID);

module.exports = router; 