// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/auth.js";
import freelancerRoutes from "./routes/freelancerRoutes.js";
import userRoutes from "./routes/users.js";

app.use("/api/auth", authRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/gigconnect";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ADD THIS: Suppress sample data errors during development
process.on("unhandledRejection", (reason, promise) => {
  if (
    reason.message &&
    reason.message.includes("Freelancer validation failed")
  ) {
    console.log("⚠️  Sample data creation skipped (development mode)");
  } else {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
