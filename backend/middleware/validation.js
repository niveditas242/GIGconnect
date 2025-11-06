const { validationResult, check } = require("express-validator");

// @desc    Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg,
    });
  }
  next();
};

// @desc    Validation rules for registration
const validateRegistration = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  check("email").isEmail().withMessage("Please include a valid email"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// @desc    Validation rules for login
const validateLogin = [
  check("email").isEmail().withMessage("Please include a valid email"),

  check("password").exists().withMessage("Password is required"),
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
};
