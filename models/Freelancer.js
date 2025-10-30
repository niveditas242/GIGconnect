import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      trim: true,
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
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    completedProjects: {
      type: Number,
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
        url: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
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
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
freelancerSchema.index({ userId: 1 });
freelancerSchema.index({ skills: 1 });
freelancerSchema.index({ level: 1 });
freelancerSchema.index({ hourlyRate: 1 });

export default mongoose.model("Freelancer", freelancerSchema);
