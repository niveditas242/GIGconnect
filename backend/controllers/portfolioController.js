// backend/controllers/portfolioController.js
const Portfolio = require("../models/Portfolio");
const Freelancer = require("../models/Freelancer");

// Save portfolio (create or update)
const savePortfolio = async (req, res) => {
  try {
    const userId = req.userId;
    const portfolioData = req.body;

    // Find or create portfolio
    let portfolio = await Portfolio.findOne({ freelancerId: userId });

    if (portfolio) {
      // Update existing portfolio
      portfolio = await Portfolio.findOneAndUpdate(
        { freelancerId: userId },
        {
          ...portfolioData,
          lastSavedAt: new Date(),
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new portfolio
      portfolio = new Portfolio({
        freelancerId: userId,
        ...portfolioData,
        lastSavedAt: new Date(),
      });
      await portfolio.save();
    }

    // Also update freelancer profile with basic info
    await Freelancer.findOneAndUpdate(
      { userId: userId },
      {
        name: portfolioData.name,
        title: portfolioData.title,
        skills: portfolioData.skills,
        location: portfolioData.location,
        profileCompleted: true,
      }
    );

    res.json({
      success: true,
      message: "Portfolio saved successfully!",
      portfolio: portfolio,
    });
  } catch (error) {
    console.error("Save portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving portfolio",
      error: error.message,
    });
  }
};

// Get portfolio for editing
const getMyPortfolio = async (req, res) => {
  try {
    const userId = req.userId;

    const portfolio = await Portfolio.findOne({ freelancerId: userId });

    if (!portfolio) {
      return res.json({
        success: true,
        portfolio: null,
        message: "No portfolio found. Create your first portfolio!",
      });
    }

    res.json({
      success: true,
      portfolio: portfolio,
    });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio",
    });
  }
};

// Publish portfolio to make freelancer searchable
const publishPortfolio = async (req, res) => {
  try {
    const userId = req.userId;

    const portfolio = await Portfolio.findOne({ freelancerId: userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found. Please save your portfolio first.",
      });
    }

    // Check if portfolio has minimum content
    if (
      !portfolio.name ||
      !portfolio.title ||
      portfolio.projects.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please complete your portfolio (name, title, and at least one project) before publishing.",
      });
    }

    // Update portfolio status
    portfolio.isPublished = true;
    portfolio.isPublic = true;
    portfolio.lastPublishedAt = new Date();

    // Make all projects public
    portfolio.projects.forEach((project) => {
      project.isPublic = true;
    });

    await portfolio.save();

    // Update freelancer profile to be public
    await Freelancer.findOneAndUpdate(
      { userId: userId },
      {
        isProfilePublic: true,
        portfolioPublished: true,
        lastPublishedAt: new Date(),
      }
    );

    res.json({
      success: true,
      message:
        "🎉 Portfolio published successfully! You are now visible to clients.",
      portfolio: {
        id: portfolio._id,
        name: portfolio.name,
        title: portfolio.title,
        isPublished: portfolio.isPublished,
        lastPublishedAt: portfolio.lastPublishedAt,
      },
    });
  } catch (error) {
    console.error("Publish portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error publishing portfolio",
    });
  }
};

// Unpublish portfolio
const unpublishPortfolio = async (req, res) => {
  try {
    const userId = req.userId;

    const portfolio = await Portfolio.findOne({ freelancerId: userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    portfolio.isPublished = false;
    portfolio.isPublic = false;
    await portfolio.save();

    // Update freelancer profile
    await Freelancer.findOneAndUpdate(
      { userId: userId },
      {
        isProfilePublic: false,
        portfolioPublished: false,
      }
    );

    res.json({
      success: true,
      message: "Portfolio unpublished successfully",
    });
  } catch (error) {
    console.error("Unpublish portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error unpublishing portfolio",
    });
  }
};

// Delete portfolio
const deletePortfolio = async (req, res) => {
  try {
    const userId = req.userId;

    const portfolio = await Portfolio.findOneAndDelete({
      freelancerId: userId,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // Update freelancer profile
    await Freelancer.findOneAndUpdate(
      { userId: userId },
      {
        portfolioPublished: false,
        isProfilePublic: false,
      }
    );

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

// Get public portfolio by freelancer ID
const getPublicPortfolio = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const portfolio = await Portfolio.findOne({
      freelancerId: freelancerId,
      isPublished: true,
      isPublic: true,
    }).populate("freelancerId", "name title skills location hourlyRate rating");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found or not published",
      });
    }

    res.json({
      success: true,
      portfolio: portfolio,
    });
  } catch (error) {
    console.error("Get public portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio",
    });
  }
};

module.exports = {
  savePortfolio,
  getMyPortfolio,
  publishPortfolio,
  unpublishPortfolio,
  deletePortfolio,
  getPublicPortfolio,
};
