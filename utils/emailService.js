// backend/utils/emailService.js
const nodemailer = require("nodemailer");

// Create transporter with better configuration
const createTransporter = () => {
  try {
    // For nodemailer v7, use createTransport (not createTransporter)
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } catch (error) {
    console.error("Error creating transporter:", error);
    return null;
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    console.log("\n🔧 Testing email configuration...");
    console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
    console.log(
      `🔑 App Password: ${process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing"}`
    );

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("❌ Email configuration incomplete");
      return false;
    }

    const transporter = createTransporter();

    if (!transporter) {
      console.log("❌ Failed to create email transporter");
      return false;
    }

    // Verify connection configuration
    await transporter.verify();
    console.log("✅ Email server connection verified");
    return true;
  } catch (error) {
    console.error("❌ Email configuration test failed:", error.message);
    return false;
  }
};

// Enhanced email service with real email sending
const sendOTPEmail = async (email, otp, name = "User") => {
  try {
    console.log("\n📧 ===== SENDING REAL OTP EMAIL =====");
    console.log(`✅ TO: ${email}`);
    console.log(`✅ OTP CODE: ${otp}`);
    console.log(`✅ FOR: ${name}`);

    // Test email configuration first
    const configValid = await testEmailConfig();

    if (!configValid) {
      console.log("🔄 Falling back to console OTP display");
      console.log(`📧 OTP for ${email}: ${otp}`);
      console.log("===============================\n");

      return {
        success: true,
        development: true,
        otp: otp,
        message: "OTP displayed in console (email config issue)",
      };
    }

    const transporter = createTransporter();

    if (!transporter) {
      throw new Error("Failed to create email transporter");
    }

    const mailOptions = {
      from: `GIGconnect <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your GIGconnect Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 0; 
              font-family: 'Arial', sans-serif; 
              background: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 10px;
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #1E3A5F 0%, #152642 100%); 
              padding: 30px; 
              text-align: center; 
              color: white;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .content { 
              padding: 30px; 
              color: #333;
              line-height: 1.6;
            }
            .otp-code { 
              font-size: 42px; 
              font-weight: bold; 
              color: #1E3A5F; 
              text-align: center; 
              margin: 30px 0; 
              letter-spacing: 8px;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              border: 2px dashed #1E3A5F;
              font-family: 'Courier New', monospace;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #6c757d; 
              font-size: 12px; 
              padding: 20px;
              background: #f8f9fa;
              border-top: 1px solid #e0e0e0;
            }
            .warning {
              background: #fff3cd;
              color: #856404;
              padding: 12px;
              border-radius: 5px;
              margin: 20px 0;
              border-left: 4px solid #ffc107;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">GIGconnect</div>
              <h2 style="margin: 10px 0 0 0; font-weight: 300;">Email Verification</h2>
            </div>
            
            <div class="content">
              <h2 style="color: #1E3A5F; margin-bottom: 10px;">Hello ${name},</h2>
              <p>Welcome to GIGconnect! Use the verification code below to complete your registration:</p>
              
              <div class="otp-code">${otp}</div>
              
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              
              <div class="warning">
                <strong>🔒 Security Notice:</strong><br>
                • Never share this code with anyone<br>
                • GIGconnect will never ask for your verification code<br>
                • Delete this email after use
              </div>
              
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            
            <div class="footer">
              <p><strong>GIGconnect - Connecting Talent with Opportunity</strong></p>
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; 2024 GIGconnect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log("📤 Sending email via Gmail SMTP...");
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log(`✅ Message ID: ${result.messageId}`);
    console.log(`✅ Recipient: ${email}`);
    console.log("===============================\n");

    return {
      success: true,
      development: false,
      messageId: result.messageId,
      message: "OTP sent successfully to your email",
    };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    console.log("🔄 Falling back to console OTP display");
    console.log(`📧 OTP for ${email}: ${otp}`);
    console.log("===============================\n");

    return {
      success: true,
      development: true,
      otp: otp,
      message: "Email failed, OTP displayed in console",
    };
  }
};

const sendWelcomeEmail = async (email, name = "User") => {
  try {
    console.log("\n🎉 ===== SENDING WELCOME EMAIL =====");

    const configValid = await testEmailConfig();
    if (!configValid) {
      console.log("✅ Welcome email simulated");
      return { success: true, development: true };
    }

    const transporter = createTransporter();

    if (!transporter) {
      throw new Error("Failed to create email transporter");
    }

    const mailOptions = {
      from: `GIGconnect <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to GIGconnect! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { max-width: 600px; margin: 0 auto; padding: 0; font-family: Arial, sans-serif; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #1E3A5F 0%, #152642 100%); color: white; padding: 40px; text-align: center; }
            .content { padding: 30px; color: #333; line-height: 1.6; }
            .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; padding: 20px; background: #f8f9fa; border-top: 1px solid #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to GIGconnect!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Welcome to GIGconnect! We're thrilled to have you join our community.</p>
              <p>Your account has been successfully created and you're ready to start your freelance journey!</p>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Happy freelancing! 🚀</p>
              <p><strong>The GIGconnect Team</strong></p>
            </div>
            <div class="footer">
              <p><strong>GIGconnect - Your Gateway to Freelance Success</strong></p>
              <p>&copy; 2024 GIGconnect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent successfully");
    return { success: true, development: false };
  } catch (error) {
    console.error("Welcome email failed:", error.message);
    return { success: false, message: "Failed to send welcome email" };
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  testEmailConfig,
};
