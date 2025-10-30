// controllers/freelancerController.js
import Freelancer from "../models/Freelancer.js";

// Search freelancers
export const searchFreelancers = async (req, res) => {
  try {
    const { query, skills, level, location } = req.query;

    let filter = {};

    // Text search
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // Skills filter
    if (skills) {
      filter.skills = { $in: [skills] };
    }

    // Level filter
    if (level) {
      filter.level = level;
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const freelancers = await Freelancer.find(filter);

    res.json({
      success: true,
      data: freelancers,
    });
  } catch (error) {
    console.error("Get freelancers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching freelancers",
    });
  }
};

// Get all freelancers
export const getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find();
    res.json({
      success: true,
      data: freelancers,
    });
  } catch (error) {
    console.error("Get all freelancers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching freelancers",
    });
  }
};

// Create sample freelancers
export const createSampleFreelancers = async (req, res) => {
  try {
    const sampleFreelancers = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        title: "Senior React Developer",
        description:
          "Experienced React developer with 5+ years of building scalable web applications.",
        skills: ["React", "JavaScript", "TypeScript", "Node.js"],
        level: "Expert",
        location: "New York, USA",
        hourlyRate: 75,
        rating: 4.8,
        completedProjects: 42,
        availability: "Available",
      },
      {
        name: "Sarah Smith",
        email: "sarah.smith@example.com",
        title: "UI/UX Designer",
        description:
          "Creative UI/UX designer specializing in user-centered design and prototyping.",
        skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
        level: "Intermediate",
        location: "London, UK",
        hourlyRate: 55,
        rating: 4.6,
        completedProjects: 28,
        availability: "Available",
      },
      {
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        title: "Full Stack Developer",
        description:
          "Full stack developer with expertise in MERN stack and cloud technologies.",
        skills: ["React", "Node.js", "MongoDB", "AWS"],
        level: "Expert",
        location: "Remote",
        hourlyRate: 85,
        rating: 4.9,
        completedProjects: 67,
        availability: "Busy",
      },
    ];

    // Clear existing samples and create new ones
    await Freelancer.deleteMany({});
    const createdFreelancers = await Freelancer.insertMany(sampleFreelancers);

    res.json({
      success: true,
      message: "Sample freelancers created successfully",
      data: createdFreelancers,
    });
  } catch (error) {
    console.error("Create samples error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating sample freelancers",
    });
  }
};
