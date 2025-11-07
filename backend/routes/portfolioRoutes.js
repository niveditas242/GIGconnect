// backend/routes/portfolioRoutes.js
const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");
const { authMiddleware } = require("../middleware/auth");

// All routes are protected (require authentication)
router.use(authMiddleware);

// Portfolio CRUD routes
router.post("/save", portfolioController.savePortfolio);
router.get("/my-portfolio", portfolioController.getMyPortfolio);
router.delete("/delete", portfolioController.deletePortfolio);

// Portfolio publication routes
router.post("/publish", portfolioController.publishPortfolio);
router.post("/unpublish", portfolioController.unpublishPortfolio);

// Public portfolio route (no auth required)
router.get("/public/:freelancerId", portfolioController.getPublicPortfolio);

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio routes are working!",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
