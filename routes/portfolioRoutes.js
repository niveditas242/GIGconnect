import express from "express";
import {
  getPortfolio,
  savePortfolio,
  uploadImage,
  publishPortfolio
} from "../controllers/portfolioController.js";

const router = express.Router();

router.get("/:userId", getPortfolio);
router.post("/:userId", savePortfolio);
router.post("/:userId/publish", publishPortfolio);
router.post("/upload/image", uploadImage);

export default router;