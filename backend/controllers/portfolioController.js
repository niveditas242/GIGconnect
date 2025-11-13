// backend/controllers/portfolioController.js
const Portfolio = require("../models/Portfolio");

// Save portfolio
const savePortfolio = async (req, res) => {
  try {
    console.log("📥 Received portfolio data:", req.body);

    const {
      name,
      title,
      bio,
      email,
      phone,
      location,
      experience,
      education,
      skills,
      projects,
      profilePhoto,
      socialLinks,
      isPublished,
      isPublic,
    } = req.body;

    // Validate required fields
    if (!name || !title || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, title, and email are required fields",
      });
    }

    // Get user ID from authenticated user
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("🆔 User ID:", userId);

    // Check if portfolio already exists for this user
    let portfolio = await Portfolio.findOne({ userId });

    if (portfolio) {
      // Update existing portfolio
      portfolio.name = name;
      portfolio.title = title;
      portfolio.bio = bio;
      portfolio.email = email;
      portfolio.phone = phone;
      portfolio.location = location;
      portfolio.experience = experience;
      portfolio.education = education;
      portfolio.skills = skills;
      portfolio.projects = projects;
      portfolio.profilePhoto = profilePhoto;
      portfolio.socialLinks = socialLinks;
      portfolio.isPublished = isPublished || false;
      portfolio.isPublic = isPublic || false;
      portfolio.lastSavedAt = new Date();
    } else {
      // Create new portfolio
      portfolio = new Portfolio({
        userId,
        name,
        title,
        bio,
        email,
        phone,
        location,
        experience,
        education,
        skills,
        projects,
        profilePhoto,
        socialLinks,
        isPublished: isPublished || false,
        isPublic: isPublic || false,
      });
    }

    // Save to database
    await portfolio.save();

    console.log("✅ Portfolio saved successfully");

    res.json({
      success: true,
      message: "Portfolio saved successfully",
      portfolio,
    });
  } catch (error) {
    console.error("❌ Save portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving portfolio: " + error.message,
    });
  }
};

// Get my portfolio
const getMyPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio",
    });
  }
};

// Publish portfolio
const publishPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found. Please save your portfolio first.",
      });
    }

    portfolio.isPublished = true;
    portfolio.isPublic = true;
    portfolio.lastPublishedAt = new Date();

    await portfolio.save();

    res.json({
      success: true,
      message: "Portfolio published successfully",
      portfolio,
    });
  } catch (error) {
    console.error("Publish portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error publishing portfolio",
    });
  }
};

// Delete portfolio
const deletePortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const portfolio = await Portfolio.findOneAndDelete({ userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.json({
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Delete portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting portfolio",
    });
  }
};

// Get public portfolio
const getPublicPortfolio = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const portfolio = await Portfolio.findOne({
      freelancerId,
      isPublished: true,
      isPublic: true,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found or not published",
      });
    }

    res.json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error("Get public portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching public portfolio",
    });
  }
};

// Unpublish portfolio
const unpublishPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    portfolio.isPublished = false;
    portfolio.isPublic = false;

    await portfolio.save();

    res.json({
      success: true,
      message: "Portfolio unpublished successfully",
      portfolio,
    });
  } catch (error) {
    console.error("Unpublish portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error unpublishing portfolio",
    });
  }
};

// Export all functions
module.exports = {
  savePortfolio,
  getMyPortfolio,
  publishPortfolio,
  deletePortfolio,
  getPublicPortfolio,
  unpublishPortfolio,
};
