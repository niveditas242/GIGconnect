// backend/routes/auth.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");
const Freelancer = require("../models/Freelancer");
const {
  sendOTPEmail,
  sendWelcomeEmail,
  testEmailConfig,
} = require("../utils/emailService");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==================== DEBUG ROUTE ====================
router.get("/debug-email", async (req, res) => {
  try {
    console.log("🔍 Debugging email configuration...");
    console.log("Environment variables:");
    console.log("- EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "- EMAIL_PASS:",
      process.env.EMAIL_PASS
        ? "***" + process.env.EMAIL_PASS.slice(-4)
        : "NOT SET"
    );

    const configTest = await testEmailConfig();

    res.json({
      success: configTest,
      emailUser: process.env.EMAIL_USER,
      hasAppPassword: !!process.env.EMAIL_PASS,
      appPasswordLength: process.env.EMAIL_PASS
        ? process.env.EMAIL_PASS.length
        : 0,
      configTest: configTest,
      message: configTest
        ? "Email configuration is correct"
        : "Email configuration has issues",
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({
      success: false,
      message: "Debug failed",
      error: error.message,
    });
  }
});

// ==================== TEST EMAIL ROUTE ====================
router.get("/test-email", async (req, res) => {
  try {
    console.log("🧪 Testing email configuration...");

    // Test configuration
    const configTest = await testEmailConfig();

    if (!configTest) {
      return res.json({
        success: false,
        message: "Email configuration test failed",
        config: {
          emailUser: process.env.EMAIL_USER,
          hasAppPassword: !!process.env.EMAIL_PASS,
        },
      });
    }

    // Test sending an email
    const testEmail = "s.nivedita567@gmail.com";
    const testOTP = "123456";

    const emailResult = await sendOTPEmail(testEmail, testOTP, "Test User");

    res.json({
      success: true,
      message: "Email test completed",
      configTest: configTest,
      emailSent: emailResult.success,
      developmentMode: emailResult.development,
      details: emailResult,
    });
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({
      success: false,
      message: "Email test failed",
      error: error.message,
    });
  }
});

// ==================== SEND OTP ROUTE ====================
router.post(
  "/send-otp",
  [body("email").isEmail().withMessage("Valid email is required")],
  async (req, res) => {
    try {
      console.log("\n🔵 ===== SEND OTP REQUEST =====");
      console.log("Request Body:", req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, name = "User", purpose = "registration" } = req.body;

      console.log(`📧 Processing OTP request for: ${email}`);
      console.log(`🎯 Purpose: ${purpose}`);

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      console.log(`🔐 Generated OTP: ${otp}`);
      console.log(`⏰ Expires at: ${expiresAt}`);

      // Delete any existing OTP for this email and purpose
      const deleteResult = await OTP.deleteMany({
        email,
        type: purpose,
      });
      console.log(`🗑️ Deleted ${deleteResult.deletedCount} previous OTPs`);

      // Save OTP to database
      const otpRecord = await OTP.create({
        email,
        otp,
        type: purpose,
        expiresAt,
        verified: false,
      });

      console.log("💾 OTP saved to database:", {
        recordId: otpRecord._id,
        email: otpRecord.email,
        otp: otpRecord.otp,
        expiresAt: otpRecord.expiresAt,
      });

      // Send OTP via email
      const emailResult = await sendOTPEmail(email, otp, name);

      if (emailResult.success) {
        console.log("✅ OTP process completed successfully");
        res.json({
          success: true,
          message: "OTP sent successfully to your email",
          development: emailResult.development || false,
          otp: process.env.NODE_ENV === "development" ? otp : undefined,
        });
      } else {
        // Clean up OTP record if email failed
        await OTP.findByIdAndDelete(otpRecord._id);
        console.log("❌ Email failed, cleaned up OTP record");

        res.status(500).json({
          success: false,
          message: "Failed to send OTP. Please try again.",
        });
      }
    } catch (error) {
      console.error("🔴 Send OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while sending OTP",
      });
    }
  }
);

// ==================== VERIFY OTP ROUTE ====================
router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("Valid OTP is required"),
  ],
  async (req, res) => {
    try {
      console.log("\n🔐 ===== OTP VERIFICATION REQUEST =====");
      console.log("Request Body:", req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, otp } = req.body;

      console.log("🔍 OTP verification details:", {
        email: email,
        otpReceived: otp,
      });

      // 🔒 PRODUCTION MODE: Real OTP verification required
      console.log("🔒 PRODUCTION MODE: Real OTP verification required");

      // Original OTP verification logic
      const normalizedEmail = email.toLowerCase().trim();
      const normalizedOTP = otp.trim();

      // Find OTP
      const otpRecord = await OTP.findOne({
        email: normalizedEmail,
        otp: normalizedOTP,
        type: "registration",
      });

      console.log(
        "🔍 OTP record search result:",
        otpRecord ? "FOUND" : "NOT FOUND"
      );

      if (!otpRecord) {
        // Check if there's any OTP for this email
        const anyOtp = await OTP.findOne({ email: normalizedEmail });
        console.log("Any OTP found for this email:", anyOtp);

        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      // Check if OTP is expired
      console.log("⏰ OTP expiration check:", {
        expiresAt: otpRecord.expiresAt,
        currentTime: new Date(),
        isExpired: otpRecord.expiresAt < new Date(),
      });

      if (otpRecord.expiresAt < new Date()) {
        await OTP.findByIdAndDelete(otpRecord._id);
        console.log("❌ OTP expired and deleted");
        return res.status(400).json({
          success: false,
          message: "OTP has expired",
        });
      }

      // Mark OTP as verified
      otpRecord.verified = true;
      await otpRecord.save();

      console.log("✅ OTP verified successfully and marked as verified");
      console.log("================================================\n");

      res.json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.error("🔴 Verify OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while verifying OTP",
      });
    }
  }
);

// ==================== REGISTER ROUTE ====================
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("userType")
      .isIn(["freelancer", "client"])
      .withMessage("Valid user type is required"),
  ],
  async (req, res) => {
    try {
      console.log("\n👤 ===== REGISTRATION REQUEST =====");
      console.log("Request Body:", JSON.stringify(req.body, null, 2));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        name,
        email,
        password,
        userType,
        title,
        skills = [],
        bio = "",
      } = req.body;

      console.log("📝 Registration details:", {
        name,
        email,
        userType,
        title,
        skillsCount: skills.length || 0,
      });

      // Check if user exists
      console.log("🔍 Checking if user already exists...");
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("❌ User already exists in database:", email);
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }
      console.log("✅ Email is available for registration");

      // Check if OTP is verified for this email
      console.log("🔐 Checking OTP verification status...");
      const verifiedOTP = await OTP.findOne({
        email: email.toLowerCase().trim(),
        type: "registration",
        verified: true,
      });

      if (verifiedOTP) {
        console.log("✅ OTP verified found:", {
          otpId: verifiedOTP._id,
          email: verifiedOTP.email,
          verified: verifiedOTP.verified,
        });
      } else {
        console.log("❌ No verified OTP found for email:", email);
        return res.status(400).json({
          success: false,
          message:
            "Email not verified. Please complete OTP verification first.",
        });
      }

      // Process skills
      let skillsArray = [];
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string") {
        skillsArray = skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill);
      }
      console.log("🛠️ Processed skills:", skillsArray);

      console.log("💾 Creating user in database...");

      // Create user
      const user = new User({
        name,
        email: email.toLowerCase().trim(),
        password,
        userType,
        title,
        skills: skillsArray,
        bio,
        isVerified: true,
      });

      await user.save();
      console.log("✅ User successfully saved to database:", {
        userId: user._id,
        email: user.email,
        userType: user.userType,
      });

      // If user is freelancer, create freelancer profile
      if (userType === "freelancer") {
        console.log("💼 Creating freelancer profile...");
        const freelancer = new Freelancer({
          userId: user._id,
          name,
          email: user.email,
          title,
          description:
            bio || `${title} with experience in ${skillsArray.join(", ")}`,
          skills: skillsArray,
          level: "Intermediate",
          location: "Remote",
          hourlyRate: 0,
          rating: 0,
          completedProjects: 0,
          availability: "Available",
        });
        await freelancer.save();
        console.log("✅ Freelancer profile created:", {
          freelancerId: freelancer._id,
        });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("🔑 JWT token generated");

      // Send welcome email
      console.log("📧 Sending welcome email...");
      const welcomeResult = await sendWelcomeEmail(email, name);
      if (welcomeResult.success) {
        console.log("✅ Welcome email sent successfully");
      } else {
        console.log("⚠️ Welcome email failed, but registration continues");
      }

      // Clean up verified OTP
      console.log("🧹 Cleaning up verified OTP record...");
      const deleteResult = await OTP.deleteOne({ _id: verifiedOTP._id });
      console.log("✅ OTP cleanup result:", deleteResult);

      console.log("🎉 REGISTRATION COMPLETED SUCCESSFULLY!");
      console.log("========================================\n");

      res.status(201).json({
        success: true,
        message: "Account created successfully!",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          title: user.title,
          skills: user.skills,
          bio: user.bio,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error("\n🔴 REGISTRATION ERROR:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
      });

      // Handle duplicate email error
      if (error.code === 11000) {
        console.log("❌ Duplicate email error - email already exists");
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        console.log("❌ Mongoose validation error:", error.errors);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: Object.values(error.errors).map((e) => e.message),
        });
      }

      console.log("❌ Unknown server error during registration");
      res.status(500).json({
        success: false,
        message: "Server error during registration",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// ... (Keep your existing LOGIN, FORGOT PASSWORD, RESET PASSWORD routes below)
// Make sure all other routes are below the router definition

module.exports = router;
