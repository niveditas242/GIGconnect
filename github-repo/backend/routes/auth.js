const express = require("express");
const {
  sendOTP,
  verifyOTP,
  register,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// OTP Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected Routes
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
