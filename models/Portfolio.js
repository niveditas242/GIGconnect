// backend/models/Portfolio.js
const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    projects: [
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
        link: {
          type: String,
          default: "",
        },
        technologies: [String],
        startDate: Date,
        endDate: Date,
        featured: {
          type: Boolean,
          default: false,
        },
      },
    ],
    experience: [
      {
        position: String,
        company: String,
        duration: String,
        description: String,
        current: {
          type: Boolean,
          default: false,
        },
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
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
    socialLinks: {
      website: String,
      github: String,
      linkedin: String,
      twitter: String,
      behance: String,
      dribbble: String,
    },
    template: {
      type: String,
      enum: ["modern", "professional", "creative", "minimal"],
      default: "modern",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    views: {
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
  },
  {
    timestamps: true,
  }
);

// Indexes
portfolioSchema.index({ userId: 1 });
portfolioSchema.index({ skills: 1 });
portfolioSchema.index({ isPublished: 1 });
portfolioSchema.index({ createdAt: -1 });

// Update updatedAt timestamp before saving
portfolioSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
