// backend/models/Freelancer.js
const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema(
  {
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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert", "Top Rated"],
      default: "Intermediate",
    },
    location: {
      type: String,
      default: "Remote",
    },
    hourlyRate: {
      type: Number,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    completedProjects: {
      type: Number,
      min: 0,
      default: 0,
    },
    availability: {
      type: String,
      enum: ["Available", "Busy", "Unavailable"],
      default: "Available",
    },
    profileImage: {
      type: String,
      default: "",
    },
    portfolio: [
      {
        title: String,
        description: String,
        image: String,
        link: String,
        technologies: [String],
      },
    ],
    socialLinks: {
      website: String,
      github: String,
      linkedin: String,
      twitter: String,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
        description: String,
      },
    ],
    experience: [
      {
        position: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        year: Number,
        credentialId: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better search performance
freelancerSchema.index({ skills: 1 });
freelancerSchema.index({ level: 1 });
freelancerSchema.index({ location: 1 });
freelancerSchema.index({ hourlyRate: 1 });
freelancerSchema.index({ rating: -1 });
freelancerSchema.index({ userId: 1 });

// Update updatedAt timestamp before saving
freelancerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Freelancer", freelancerSchema);
