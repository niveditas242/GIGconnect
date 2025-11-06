const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
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
    required: true,
    enum: ["web-development", "mobile-app", "ui-ux", "graphic-design", "other"],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const freelancerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
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
    trim: true,
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
  portfolio: [projectSchema],
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  isProfilePublic: {
    type: Boolean,
    default: false,
  },
  portfolioPublished: {
    type: Boolean,
    default: false,
  },
  lastPublishedAt: {
    type: Date,
  },
  rating: {
    type: Number,
    default: 0,
  },
  hourlyRate: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
freelancerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Freelancer = mongoose.model("Freelancer", freelancerSchema);

module.exports = Freelancer;
