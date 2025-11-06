const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const freelancerRoutes = require("./routes/freelancerRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const searchRoutes = require("./routes/search");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/search", searchRoutes);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "GIGconnect API is running!" });
});

app.get("/api/auth", (req, res) => {
  res.json({ message: "Auth endpoint is working!" });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
