const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email configuration
const testEmailConfig = async () => {
  try {
    console.log("🔧 Testing email configuration...");
    console.log("📧 Email User:", process.env.EMAIL_USER);
    console.log(
      "🔑 App Password:",
      process.env.EMAIL_PASS ? "✓ Set" : "✗ Not set"
    );

    await transporter.verify();
    console.log("✅ Email configuration is correct!");
    return true;
  } catch (error) {
    console.log("❌ Email configuration test failed:", error.message);
    return false;
  }
};

// Send OTP Email
const sendOTPEmail = async (email, otp, purpose = "registration") => {
  try {
    const isConfigValid = await testEmailConfig();

    if (!isConfigValid) {
      console.log("🔄 Falling back to console OTP display");
      console.log(`📧 OTP for ${email}: ${otp}`);
      return { success: true, method: "console" };
    }

    const subject =
      purpose === "registration"
        ? "Verify Your Email - GIGconnect"
        : "Reset Your Password - GIGconnect";

    const text =
      purpose === "registration"
        ? `Welcome to GIGconnect! Your verification code is: ${otp}. This code will expire in 10 minutes.`
        : `Your password reset code is: ${otp}. This code will expire in 10 minutes.`;

    const html =
      purpose === "registration"
        ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to GIGconnect! 🎉</h2>
          <p>Your verification code is:</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `
        : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>Your password reset code is:</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `;

    console.log("📧 ===== SENDING REAL OTP EMAIL =====");
    console.log("✅ TO:", email);
    console.log("✅ OTP CODE:", otp);
    console.log(
      "✅ FOR:",
      purpose === "registration" ? "User Registration" : "Password Reset"
    );

    const mailOptions = {
      from:
        process.env.EMAIL_FROM || `"GIGconnect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

    return {
      success: true,
      method: "email",
      messageId: info.messageId,
    };
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
    console.log("🔄 Falling back to console OTP display");
    console.log(`📧 OTP for ${email}: ${otp}`);

    return {
      success: true,
      method: "console",
      error: error.message,
    };
  }
};

module.exports = {
  sendOTPEmail,
  testEmailConfig,
};
