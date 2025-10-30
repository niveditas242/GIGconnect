import nodemailer from "nodemailer";

// Simple email service for development
export const sendOTPEmail = async (email, otp, name = "User") => {
  try {
    // For development, always use console logging
    console.log("\n📧 ===== OTP EMAIL =====");
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log(`Name: ${name}`);
    console.log("========================\n");

    return { success: true, development: true };
  } catch (error) {
    console.error("❌ Email sending failed:", error);

    // Fallback - always log to console
    console.log("\n📧 ===== FALLBACK OTP EMAIL =====");
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log("================================\n");

    return { success: true, fallback: true };
  }
};

export const sendWelcomeEmail = async (email, name = "User") => {
  try {
    console.log("\n📧 ===== WELCOME EMAIL =====");
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log("============================\n");

    return { success: true, development: true };
  } catch (error) {
    console.error("Welcome email failed:", error);
    return { success: true, fallback: true };
  }
};

export const sendPasswordResetEmail = async (email, otp, name = "User") => {
  try {
    console.log("\n📧 ===== PASSWORD RESET EMAIL =====");
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log("==================================\n");

    return { success: true, development: true };
  } catch (error) {
    console.error("Password reset email failed:", error);
    return { success: true, fallback: true };
  }
};

export default {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
