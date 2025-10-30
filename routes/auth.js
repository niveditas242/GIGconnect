// routes/auth.js
import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import Freelancer from "../models/Freelancer.js";
import { sendOTPEmail, sendWelcomeEmail } from "../utils/emailService.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Enhanced Register Route with OTP Verification
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
    body("title").notEmpty().withMessage("Title is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
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

      console.log("Registration attempt:", { name, email, userType, title });

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Check if OTP is verified for this email
      const verifiedOTP = await OTP.findOne({
        email,
        type: "registration",
        verified: true,
      });

      if (!verifiedOTP) {
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

      // Create user
      const user = new User({
        name,
        email,
        password,
        userType,
        title,
        skills: skillsArray,
        bio,
        isVerified: true,
      });

      await user.save();

      // If user is freelancer, create freelancer profile
      if (userType === "freelancer") {
        const freelancer = new Freelancer({
          userId: user._id, // ADDED: This was missing!
          name,
          email,
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
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send welcome email
      await sendWelcomeEmail(email, name);

      // Clean up verified OTP
      await OTP.deleteOne({ _id: verifiedOTP._id });

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
      console.error("Registration error:", error);

      // Handle duplicate email error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("userType")
      .isIn(["freelancer", "client"])
      .withMessage("Valid user type is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password, userType } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check user type
      if (user.userType !== userType) {
        return res.status(400).json({
          success: false,
          message: `This email is registered as a ${user.userType}, not a ${userType}`,
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Please verify your email before logging in",
        });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        success: true,
        message: "Login successful!",
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
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  }
);

// Send OTP for Registration
router.post(
  "/send-otp",
  [body("email").isEmail().withMessage("Valid email is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, name = "User" } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete any existing OTP for this email
      await OTP.deleteMany({ email, type: "registration" });

      // Save OTP to database
      const otpRecord = await OTP.create({
        email,
        otp,
        type: "registration",
        expiresAt,
        verified: false,
      });

      // Send OTP via email
      const emailResult = await sendOTPEmail(email, otp, name);

      if (emailResult.success) {
        res.json({
          success: true,
          message: "OTP sent successfully to your email",
          development: emailResult.development || false,
          previewUrl: emailResult.info
            ? require("nodemailer").getTestMessageUrl(emailResult.info)
            : null,
        });
      } else {
        // Clean up OTP record if email failed
        await OTP.findByIdAndDelete(otpRecord._id);

        res.status(500).json({
          success: false,
          message: "Failed to send OTP. Please try again.",
        });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while sending OTP",
      });
    }
  }
);

// Verify OTP for Registration
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, otp } = req.body;

      console.log("🔍 OTP VERIFICATION DEBUG:");
      console.log("Email:", email);
      console.log("OTP received:", otp);

      // 🔧 DEVELOPMENT OVERRIDE - REMOVE IN PRODUCTION
      if (process.env.NODE_ENV === "development") {
        console.log("🛠️ DEVELOPMENT MODE: OTP verification override enabled");

        // For development, accept any 6-digit number as valid OTP
        if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
          console.log("🛠️ Using development OTP override");

          // Find or create OTP record
          let otpRecord = await OTP.findOne({
            email: email.toLowerCase().trim(),
            type: "registration",
          });

          if (!otpRecord) {
            otpRecord = new OTP({
              email: email.toLowerCase().trim(),
              otp: otp,
              type: "registration",
              expiresAt: new Date(Date.now() + 10 * 60 * 1000),
              verified: true,
            });
            await otpRecord.save();
          } else {
            otpRecord.verified = true;
            await otpRecord.save();
          }

          console.log("✅ OTP verified via development override");
          return res.json({
            success: true,
            message: "OTP verified successfully (development mode)",
          });
        }
      }

      // Original OTP verification logic
      const normalizedEmail = email.toLowerCase().trim();
      const normalizedOTP = otp.trim();

      // Find OTP
      const otpRecord = await OTP.findOne({
        email: normalizedEmail,
        otp: normalizedOTP,
        type: "registration",
      });

      console.log("OTP record found:", otpRecord);

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
      console.log("OTP expires at:", otpRecord.expiresAt);
      console.log("Current time:", new Date());

      if (otpRecord.expiresAt < new Date()) {
        await OTP.findByIdAndDelete(otpRecord._id);
        return res.status(400).json({
          success: false,
          message: "OTP has expired",
        });
      }

      // Mark OTP as verified
      otpRecord.verified = true;
      await otpRecord.save();

      console.log("✅ OTP verified successfully");

      res.json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while verifying OTP",
      });
    }
  }
);

// Forgot Password - Send OTP
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "No account found with this email",
        });
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete any existing password reset OTP for this email
      await OTP.deleteMany({ email, type: "password_reset" });

      // Save OTP to database
      const otpRecord = await OTP.create({
        email,
        otp,
        type: "password_reset",
        expiresAt,
      });

      // Send OTP via email
      const emailResult = await sendOTPEmail(email, otp, user.name);

      if (emailResult.success) {
        res.json({
          success: true,
          message: "Password reset OTP sent to your email",
          development: emailResult.development || false,
        });
      } else {
        // Clean up OTP record if email failed
        await OTP.findByIdAndDelete(otpRecord._id);

        res.status(500).json({
          success: false,
          message: "Failed to send OTP. Please try again.",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while processing forgot password",
      });
    }
  }
);

// Reset Password
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("Valid OTP is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, otp, newPassword } = req.body;

      // Verify OTP first
      const otpRecord = await OTP.findOne({
        email,
        otp,
        type: "password_reset",
      });

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      if (otpRecord.expiresAt < new Date()) {
        await OTP.findByIdAndDelete(otpRecord._id);
        return res.status(400).json({
          success: false,
          message: "OTP has expired",
        });
      }

      // Find user and update password
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      user.password = newPassword;
      await user.save();

      // Delete OTP after successful reset
      await OTP.findByIdAndDelete(otpRecord._id);

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while resetting password",
      });
    }
  }
);

// Resend OTP
router.post(
  "/resend-otp",
  [body("email").isEmail().withMessage("Valid email is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, name = "User", type = "registration" } = req.body;

      // Generate new OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete any existing OTP for this email and type
      await OTP.deleteMany({ email, type });

      // Save new OTP to database
      const otpRecord = await OTP.create({
        email,
        otp,
        type,
        expiresAt,
        verified: false,
      });

      // Send OTP via email
      const emailResult = await sendOTPEmail(email, otp, name);

      if (emailResult.success) {
        res.json({
          success: true,
          message: "OTP resent successfully",
          development: emailResult.development || false,
        });
      } else {
        // Clean up OTP record if email failed
        await OTP.findByIdAndDelete(otpRecord._id);

        res.status(500).json({
          success: false,
          message: "Failed to resend OTP. Please try again.",
        });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while resending OTP",
      });
    }
  }
);

// Verify Token Route
router.get("/verify-token", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.json({
      success: true,
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
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// Test email route
router.post("/test-email", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await sendOTPEmail(email, "123456", name || "Test User");

    res.json({
      success: true,
      message: "Test email processed",
      result,
      environment: process.env.NODE_ENV,
      note:
        process.env.NODE_ENV === "development" && !process.env.EMAIL_USER
          ? "Check console for Ethereal preview URL"
          : "Email sent via SMTP",
    });
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process test email",
    });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes are working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

export default router;
