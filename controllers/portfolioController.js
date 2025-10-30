import Portfolio from "../models/Portfolio.js";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get portfolio by user ID
export const getPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }
    
    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio"
    });
  }
};

// Create or update portfolio
export const savePortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolioData = req.body;
    
    let portfolio = await Portfolio.findOne({ userId });
    
    if (portfolio) {
      // Update existing portfolio
      portfolio = await Portfolio.findOneAndUpdate(
        { userId },
        portfolioData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new portfolio
      portfolio = await Portfolio.create({
        userId,
        ...portfolioData
      });
    }
    
    res.json({
      success: true,
      message: "Portfolio saved successfully",
      data: portfolio
    });
  } catch (error) {
    console.error("Error saving portfolio:", error);
    res.status(500).json({
      success: false,
      message: "Error saving portfolio"
    });
  }
};

// Upload image to Cloudinary
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image provided"
      });
    }
    
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "gigconnect/portfolios",
      resource_type: "image"
    });
    
    res.json({
      success: true,
      data: {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
      }
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image"
    });
  }
};

// Publish portfolio
export const publishPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId },
      { isPublished: true },
      { new: true }
    );
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }
    
    res.json({
      success: true,
      message: "Portfolio published successfully",
      data: portfolio
    });
  } catch (error) {
    console.error("Error publishing portfolio:", error);
    res.status(500).json({
      success: false,
      message: "Error publishing portfolio"
    });
  }
};