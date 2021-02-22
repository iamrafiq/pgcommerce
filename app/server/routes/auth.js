
const express = require('express');
const router = express.Router();
const {signup, signin, signout, changePassword, alterRole, alterBlock, isBlocked, requireSignin, isAuth, isAdmin} = require('../controllers/auth');
const {signupConditionByEmail,signupConditionByPhoneNumber, changePasswordCondition, authValidator} = require('../validator/index');
const {storeFiles} = require("../controllers/file")
const {responce} = require("../controllers/responce")
const {userByUUID} = require("../controllers/user")

//public api 
router.post('/signup/email',signupConditionByEmail, authValidator,storeFiles, signup,responce);
router.post('/signup/phone',signupConditionByPhoneNumber, authValidator,storeFiles, signup,responce);
router.post('/signin', signin, responce);
router.get('/signout', signout);

//private api
router.put('/change/password/:userUUID', requireSignin, isAuth, isBlocked, isAdmin, changePasswordCondition, authValidator, changePassword, responce);
router.put('/alter/role/:userUUID', requireSignin, isAuth, isBlocked, isAdmin, authValidator, alterRole, responce);
router.put('/alter/block/:userUUID', requireSignin, isAuth, isBlocked, isAdmin, authValidator, alterBlock, responce);

//middleware
router.param("userUUID", userByUUID);

module.exports = router; 