// backend/models/OTP.js
const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["registration", "password_reset"],
    default: "registration",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create TTL index for automatic expiration
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for better query performance
OTPSchema.index({ email: 1, type: 1 });
OTPSchema.index({ email: 1, otp: 1, type: 1 });

module.exports = mongoose.model("OTP", OTPSchema);
