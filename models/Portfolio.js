import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  technologies: [{
    type: String
  }],
  category: {
    type: String,
    enum: ["web-development", "mobile-app", "ui-ux", "graphic-design", "other"],
    default: "web-development"
  },
  liveUrl: {
    type: String
  },
  githubUrl: {
    type: String
  }
}, {
  timestamps: true
});

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: ""
    },
    hourlyRate: {
      type: Number,
      default: 0
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ""
    },
    avatar: {
      type: String,
      default: ""
    }
  },
  skills: [{
    type: String
  }],
  projects: [projectSchema],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    year: String
  }],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model("Portfolio", portfolioSchema);