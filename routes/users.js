// routes/users.js
import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get current user profile (protected route)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
});

// Update user profile (protected route)
router.put(
  "/profile",
  [
    auth,
    body("name")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("title")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Title must be at least 2 characters"),
    body("bio")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Bio cannot exceed 1000 characters"),
    body("hourlyRate")
      .optional()
      .isNumeric()
      .withMessage("Hourly rate must be a number"),
    body("experienceLevel")
      .optional()
      .isIn(["Beginner", "Intermediate", "Expert", "Top Rated"])
      .withMessage("Invalid experience level"),
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
        title,
        bio,
        skills,
        location,
        hourlyRate,
        experienceLevel,
      } = req.body;

      const updateData = {
        ...(name && { name }),
        ...(title && { title }),
        ...(bio && { bio }),
        ...(skills && { skills: Array.isArray(skills) ? skills : [skills] }),
        ...(location && { location }),
        ...(hourlyRate && { hourlyRate }),
        ...(experienceLevel && { experienceLevel }),
        updatedAt: new Date(),
      };

      const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating profile",
      });
    }
  }
);

// Get all users (for admin purposes)
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
});

// Delete user account (protected route)
router.delete("/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting account",
    });
  }
});

// Update user verification status (admin only)
router.patch("/:id/verify", auth, async (req, res) => {
  try {
    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified, updatedAt: new Date() },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User ${isVerified ? "verified" : "unverified"} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Update verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating verification status",
    });
  }
});

// Get user statistics
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const freelancers = await User.countDocuments({ userType: "freelancer" });
    const clients = await User.countDocuments({ userType: "client" });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        freelancers,
        clients,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user statistics",
    });
  }
});

export default router;
