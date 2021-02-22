const { body, validationResult } = require("express-validator");
exports.signupConditionByEmail = [
  body("name", "Name is required").notEmpty(),
  body("userId", "Email must be between 3 to 32 characters")
    .matches(/^\S+@\S+\.\S+$/)
    .withMessage("Invalid email address")
    .isLength({
      min: 4,
      max: 32,
    }),
  body("password", "Password is required").notEmpty(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];
exports.signupConditionByPhoneNumber = [
  body("name", "Name is required").notEmpty(),
  // body("userID", "Phone number must have more then 10 characters")
  //   .matches(/^\d+$/)
  //   .withMessage("Invalid phone number"),

  body("password", "Password is required").notEmpty(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];
exports.changePasswordCondition = [
  body("password", "Password is required").notEmpty(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];
exports.authValidator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //return res.status(400).json({ errors: errors.array() });
    const firstError = errors.array().map((error) => `${error.msg}`)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
