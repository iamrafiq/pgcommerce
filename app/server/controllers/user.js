const {failed } = require("./responce");
const db = require("../models/index");

exports.userByUUID = async (req, res, next, uuid) => {
    try {
      const user = await db.User.findOne({ where: { uuid } });
      if (user === null) {
        failed(
          res,
          `Unable to find user by UUID. ${uuid}`,
          (error = { name: "not_found" })
        );
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      failed(res, `Unable to find user by UUID. ${uuid}`, error);
    }
  };


  exports.read = async (req, res) => {
    res.status(200).json({
      success: true,
      message: "User retrieve successfully.",
      results: req.user,
    });
  };

  exports.update = async(req, res) => {
   const { userId, password, oldPassword } = req.body;
   try {
    const user = await db.User.findOne({ where: { userId } });
    if (user === null) {
     failed(
       res,
       `Unable to find user by ${userId}`,
       (error = { name: "not_found" })
     );
   }else{
     const {role, salt, hashedPassword, ...rest} = user.dataValues;
     if (!(await user.authenticate(oldPassword, salt, hashedPassword))) { // confirming user gave right password
      failed(
          res,
          `Please provide correct old password`,
          (error = { name: "not_found" })
        );
    }else{

    }
  
   } 
   } catch (error) {
     
   }
 
  //  User.findOne({ _id: req.profile._id }, (err, user) => {
  //      if (err || !user) {
  //          return res.status(400).json({
  //              error: 'User not found'
  //          });
  //      }
  //      if (!name) {
  //          return res.status(400).json({
  //              error: 'Name is required'
  //          });
  //      } else {
  //          user.name = name;
  //      }
 
  //      if (password) {
  //          if (password.length < 6) {
  //              return res.status(400).json({
  //                  error: 'Password should be min 6 characters long'
  //              });
  //          } else {
  //              user.password = password;
  //          }
  //      }
 
  //      user.save((err, updatedUser) => {
  //          if (err) {
  //              console.log('USER UPDATE ERROR', err);
  //              return res.status(400).json({
  //                  error: 'User update failed'
  //              });
  //          }
  //          updatedUser.hashed_password = undefined;
  //          updatedUser.salt = undefined;
  //          res.json(updatedUser);
  //      });
  //  });
 };