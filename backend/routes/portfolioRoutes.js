const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");
const { authMiddleware } = require("../middleware/auth");

// All routes are protected (require authentication)
router.use(authMiddleware);

// Portfolio publication routes
router.post("/publish", portfolioController.publishPortfolio);
router.post("/unpublish", portfolioController.unpublishPortfolio);

// Portfolio project CRUD routes
router.post("/projects", portfolioController.addPortfolioProject);
router.put("/projects/:projectId", portfolioController.updatePortfolioProject);
router.delete(
  "/projects/:projectId",
  portfolioController.deletePortfolioProject
);

// Get portfolio routes
router.get("/my-portfolio", portfolioController.getMyPortfolio);
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
