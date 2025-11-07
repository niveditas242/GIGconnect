// backend/models/Portfolio.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: [
        "web-development",
        "mobile-app",
        "ui-ux",
        "graphic-design",
        "other",
      ],
      default: "web-development",
    },
    liveUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const portfolioSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    education: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    projects: [projectSchema],
    profilePhoto: {
      type: String,
      default: "",
    },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
    lastPublishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
portfolioSchema.index({
  name: "text",
  title: "text",
  bio: "text",
  skills: "text",
  "projects.title": "text",
  "projects.description": "text",
  "projects.technologies": "text",
});

portfolioSchema.index({ isPublished: 1, isPublic: 1 });
portfolioSchema.index({ freelancerId: 1 });

module.exports = mongoose.model("Portfolio", portfolioSchema);
