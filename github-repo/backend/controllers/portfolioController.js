const Freelancer = require("../models/Freelancer");

// Publish portfolio to make freelancer searchable
const publishPortfolio = async (req, res) => {
  try {
    const freelancerId = req.userId; // Changed from req.user.id to req.userId

    const freelancer = await Freelancer.findOne({ userId: freelancerId });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    if (!freelancer.portfolio || freelancer.portfolio.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one project to your portfolio before publishing",
      });
    }

    freelancer.isProfilePublic = true;
    freelancer.portfolioPublished = true;
    freelancer.lastPublishedAt = new Date();

    freelancer.portfolio.forEach((item) => {
      item.isPublic = true;
    });

    await freelancer.save();

    res.json({
      success: true,
      message:
        "Portfolio published successfully! You are now visible in search results.",
      freelancer: {
        id: freelancer._id,
        name: freelancer.name,
        title: freelancer.title,
        isProfilePublic: freelancer.isProfilePublic,
        portfolioPublished: freelancer.portfolioPublished,
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
    const freelancerId = req.userId; // Changed from req.user.id to req.userId

    const freelancer = await Freelancer.findOne({ userId: freelancerId });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    freelancer.isProfilePublic = false;
    freelancer.portfolioPublished = false;

    await freelancer.save();

    res.json({
      success: true,
      message: "Portfolio unpublished successfully",
      freelancer: {
        id: freelancer._id,
        name: freelancer.name,
        isProfilePublic: freelancer.isProfilePublic,
      },
    });
  } catch (error) {
    console.error("Unpublish portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error unpublishing portfolio",
    });
  }
};

// Add project to portfolio
const addPortfolioProject = async (req, res) => {
  try {
    const freelancerId = req.userId; // Changed from req.user.id to req.userId
    const {
      title,
      description,
      image,
      technologies,
      category,
      liveUrl,
      githubUrl,
    } = req.body;

    const freelancer = await Freelancer.findOne({ userId: freelancerId });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    const newProject = {
      title,
      description,
      image: image || "",
      technologies: technologies || [],
      category: category || "web-development",
      liveUrl: liveUrl || "",
      githubUrl: githubUrl || "",
      isPublic: false,
    };

    freelancer.portfolio.push(newProject);
    await freelancer.save();

    res.json({
      success: true,
      message: "Project added to portfolio successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Add portfolio project error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding project to portfolio",
    });
  }
};

// Update portfolio project
const updatePortfolioProject = async (req, res) => {
  try {
    const freelancerId = req.userId; // Changed from req.user.id to req.userId
    const { projectId } = req.params;
    const {
      title,
      description,
      image,
      technologies,
      category,
      liveUrl,
      githubUrl,
    } = req.body;

    const freelancer = await Freelancer.findOne({ userId: freelancerId });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    const project = freelancer.portfolio.id(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.image = image || project.image;
    project.technologies = technologies || project.technologies;
    project.category = category || project.category;
    project.liveUrl = liveUrl || project.liveUrl;
    project.githubUrl = githubUrl || project.githubUrl;

    await freelancer.save();

    res.json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update portfolio project error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
    });
  }
};

// Delete portfolio project
const deletePortfolioProject = async (req, res) => {
  try {
    const freelancerId = req.userId; // Changed from req.user.id to req.userId
    const { projectId } = req.params;

    const freelancer = await Freelancer.findOne({ userId: freelancerId });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    const project = freelancer.portfolio.id(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    freelancer.portfolio.pull(projectId);
    await freelancer.save();

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete portfolio project error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
    });
  }
};

// Get freelancer's own portfolio
const getMyPortfolio = async (req, res) => {
  try {
    const freelancerId = req.userId; // Changed from req.user.id to req.userId

    const freelancer = await Freelancer.findOne({ userId: freelancerId });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    res.json({
      success: true,
      portfolio: freelancer.portfolio,
      isProfilePublic: freelancer.isProfilePublic,
      portfolioPublished: freelancer.portfolioPublished,
    });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio",
    });
  }
};

// Get public portfolio by freelancer ID
const getPublicPortfolio = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const freelancer = await Freelancer.findOne({
      _id: freelancerId,
      isProfilePublic: true,
      portfolioPublished: true,
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found or not published",
      });
    }

    const publicPortfolio = freelancer.portfolio.filter(
      (item) => item.isPublic
    );

    res.json({
      success: true,
      freelancer: {
        name: freelancer.name,
        title: freelancer.title,
        skills: freelancer.skills,
        location: freelancer.location,
        hourlyRate: freelancer.hourlyRate,
        rating: freelancer.rating,
      },
      portfolio: publicPortfolio,
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
  publishPortfolio,
  unpublishPortfolio,
  addPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  getMyPortfolio,
  getPublicPortfolio,
};
