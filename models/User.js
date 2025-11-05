// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    userType: {
      type: String,
      required: true,
      enum: ["freelancer", "client"],
      // default to client so frontend does not need to supply userType
      default: "client",
    },
    title: {
      type: String,
      trim: true,
      default: "",
      // required only when userType is freelancer
      required: function () {
        return this.userType === "freelancer";
      },
      maxlength: [100, "Title cannot be more than 100 characters"],
      validate: {
        validator: function (v) {
          if (this.userType === "freelancer") {
            return typeof v === "string" && v.trim().length > 0;
          }
          return true;
        },
        message: "Title is required",
      },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    hourlyRate: {
      type: Number,
      min: 0,
      default: 0,
    },
    location: {
      type: String,
      default: "Remote",
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert", "Top Rated"],
      default: "Intermediate",
    },
    isVerified: {
      type: Boolean,
      default: false,
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

// Indexes for search performance
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ skills: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt timestamp
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
