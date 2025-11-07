// backend/routes/search.js
const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const Freelancer = require("../models/Freelancer");

// Search freelancers with published portfolios
router.get("/freelancers", async (req, res) => {
  try {
    const {
      skills,
      category,
      experience,
      location,
      searchQuery,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {
      isPublished: true,
      isPublic: true,
    };

    // Text search across multiple fields
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(",").map((skill) => skill.trim());
      query.skills = { $in: skillsArray };
    }

    // Filter by category
    if (category && category !== "all") {
      query["projects.category"] = category;
    }

    // Filter by location
    if (location && location !== "any") {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by experience
    if (experience && experience !== "any") {
      query.experience = experience;
    }

    const skip = (page - 1) * limit;

    const freelancers = await Portfolio.find(query)
      .populate(
        "freelancerId",
        "name title skills location hourlyRate rating profilePhoto"
      )
      .sort({ lastPublishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "name title bio skills location experience projects profilePhoto"
      );

    const total = await Portfolio.countDocuments(query);

    res.json({
      success: true,
      freelancers: freelancers.map((freelancer) => ({
        id: freelancer._id,
        freelancerId: freelancer.freelancerId?._id,
        name: freelancer.name,
        title: freelancer.title,
        bio: freelancer.bio,
        skills: freelancer.skills,
        location: freelancer.location,
        experience: freelancer.experience,
        profilePhoto: freelancer.profilePhoto,
        projects: freelancer.projects.filter((p) => p.isPublic).slice(0, 3), // Show only 3 projects in search
        hourlyRate: freelancer.freelancerId?.hourlyRate,
        rating: freelancer.freelancerId?.rating,
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Search freelancers error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching freelancers",
      error: error.message,
    });
  }
});

// Get search filters (skills, locations, etc.)
router.get("/filters", async (req, res) => {
  try {
    const skills = await Portfolio.distinct("skills", { isPublished: true });
    const locations = await Portfolio.distinct("location", {
      isPublished: true,
    });
    const categories = await Portfolio.distinct("projects.category", {
      isPublished: true,
    });

    res.json({
      success: true,
      filters: {
        skills: skills.filter((skill) => skill).sort(),
        locations: locations.filter((location) => location).sort(),
        categories: categories.filter((category) => category).sort(),
        experienceLevels: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
      },
    });
  } catch (error) {
    console.error("Get filters error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching search filters",
    });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Search routes are working!",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
