
const expressJwt = require("express-jwt");
const db = require("../models/index");
const { success, failed } = require("./responce");
const nodemailer = require("nodemailer");

var admin = require('firebase-admin');

exports.verifyToken = (req, res, next) =>{
  // req.firebaseUID = 'lCEgrUbsIZWaxIYBd5ksqw4VmED2u';
  // next();
  admin
  .auth()
  .verifyIdToken(req.header('authorization'))
  .then((decodedToken) => {
    req.firebaseUID = decodedToken.uid;
    console.log("hhhhhhhhh", decodedToken.uid);
    next();
    
  })
  .catch((error) => {
   failed(res, `Unauthorized user!!!!`, error);
  });

}

exports.authenticate = async (req, res, next)=>{
  try {
    const {firebaseUID} = req;

    console.log("log 0", firebaseUID)
    const auth = await db.Auth.findOne({ where: { uuid: firebaseUID } });
    console.log("log 1")
    if (auth){
      const { id, ...rest} = auth.dataValues;
      req.responce = {
        success: true,
        code: 200,
        message: "You logged-in successfully.",
        results: {
          ...rest,
        },
      };
      next();
    }else{
      console.log("log 2")

      const { role } = req.body;
      
      let auth = "";
      if (role){
        if (role < 0)
        // protecting super admin
        throw "Invalid input!!!!";
        auth = await db.Auth.create({
          uuid:firebaseUID, ...req.body,
        });

      }else{
        console.log("log 3")

        let role = 100; // setting user role buyer
        auth = await db.Auth.create({
          uuid:firebaseUID, role, ...req.body,
        });
      }
      const { id, ...rest} = auth.dataValues;
      req.responce = {
        success: true,
        code: 200,
        message: "Your account has been successfully created.",
        results: {
          ...rest,
        },
      };
      next();
    }
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to create your account please try again.",
      error,
    };
    console.log("error", error)
    next();
  }
}

exports.signup = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (role < 0)
      // protecting super admin
      throw "Invalid input!!!!";

    const user = await db.User.create({
      ...req.body,
    });

    const { id, hashedPassword, salt, password, ...rest } = user.dataValues;
    
    const activeFiles = [];
    const { photo } = req.body;
    if (photo) {
      activeFiles.push({
        genre: "user",
        componentUUID: user.uuid,
        componentSlug: user.userId,
        componentField: "photo",
        url: photo,
      });
    }
    req.activeFiles = activeFiles;
    req.responce = {
      success: true,
      code: 200,
      message: "Your account has been successfully created.",
      results: {
        ...rest,
      },
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to create your account please try again.",
      error,
    };
    next();
  }
};

exports.signin = async (req, res, next) => {
  //find the user based on userId
  const { userId, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { userId } });
    if (user === null) {
      failed(
        res,
        `Unable to find user by ${userId}`,
        (error = { name: "not_found" })
      );
    } else {
      const { salt, hashedPassword } = user.dataValues;

      if (!(await user.authenticate(password, salt, hashedPassword))) {
        failed(
          res,
          `User phone/email or password did not matched, please try again`,
          (error = { name: "not_found" })
        );
      } else {
        const token = jwt.sign({ _id: user.uuid }, process.env.JWT_SECRET);
        res.cookie("t", token, { expire: new Date() + 9999 }); // here 9999 in seconds
        req.responce = {
          success: true,
          code: 200,
          message: "You logged-in successfully.",
          results: {
            token,
            user,
          },
        };
        next();
      }
    }
  } catch (error) {
    failed(
      res,
      `User phone / email or password did not matched, please try again`,
      error
    );
  }
};
exports.changePassword = async (req, res, next) => {
  const { password, oldPassword } = req.body;
  const { dataValues } = req.user;
  try {
    const { id, salt, hashedPassword, ...rest } = dataValues;
    if (!(await req.user.authenticate(oldPassword, salt, hashedPassword))) {
      // confirming user gave right password
      failed(
        res,
        `Please provide correct old password`,
        (error = { name: "not_found" })
      );
    } else {
      await db.User.update(
        { password, oldPassword, salt, hashedPassword },
        {
          where: {
            id,
          },
        }
      );
    }
    req.responce = {
      success: true,
      code: 200,
      message: "Your password changed successfully.",
      results: {},
    };
    next();
  } catch (error) {
    failed(res, `Unable to update your password, please try again`, error);
  }
};
exports.alterRole = async (req, res, next) => {
  const { userId } = req.body;
  const user = await db.User.findOne({ where: { userId } });
  try {
    const { id, role, ...rest } = user.dataValues;
    if (role < 0) {
      // you can not alter super admin role
      failed(
        res,
        `Invalid operation!!!  Super admin role not alterable`,
        (error = { name: "not_found" })
      );
    } else {
      await db.User.update(
        { role: req.body.role },
        {
          where: {
            id,
          },
        }
      );
    }
    req.responce = {
      success: true,
      code: 200,
      message: "User role altered successfully.",
      results: {},
    };
    next();
  } catch (error) {
    failed(res, `Unable to alter user role, please try again`, error);
  }
};
exports.alterBlock = async (req, res, next) => {
  const { userId } = req.body;
  const user = await db.User.findOne({ where: { userId } });
  try {
    const { id, role, block, ...rest } = user.dataValues;
    if (role < 0) {
      // you can not block super admin
      failed(
        res,
        `Invalid operation!!!  Super admin is not blockable`,
        (error = { name: "not_found" })
      );
    } else {
      await db.User.update(
        { block: req.body.block },
        {
          where: {
            id,
          },
        }
      );
    }
    req.responce = {
      success: true,
      code: 200,
      message: "User block status altered successfully.",
      results: {},
    };
    next();
  } catch (error) {
    failed(res, `Unable to alter user block status, please try again`, error);
  }
};
exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({
    message: "Signout successfully",
  });
};


exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth", // user UIID will be found here as _id;
});

exports.isAuth = (req, res, next) => {
  const { uuid } = req.user;
  let user = req.user && req.auth && uuid == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied, not authenticated user",
    });
  }

  next();
};

exports.isClerk = (req, res, next) => {
  if (req.user.role > 99) {
    return res.status(403).json({
      error: "Clerk resourse! Access denied",
    });
  }
  next();
};

exports.isBlocked = (req, res, next) => {
  if (req.user.block === 1) {
    return res.status(403).json({
      error: "Your account is blocked, please inform admin",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role > 50) {
    return res.status(403).json({
      error: "Admin resourse! Access denied",
    });
  }
  next();
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role > 0) {
    return res.status(403).json({
      error: "Super Admin resourse! Access denied",
    });
  }
  next();
};
