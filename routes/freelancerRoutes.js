// routes/freelancerRoutes.js
import express from "express";
import {
  searchFreelancers,
  getAllFreelancers,
  createSampleFreelancers,
} from "../controllers/freelancerController.js";

const router = express.Router();

router.get("/search", searchFreelancers);
router.get("/", getAllFreelancers);
router.post("/sample", createSampleFreelancers);

export default router;
