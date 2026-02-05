import nodemailer from "nodemailer";

// Check if email is configured
const isEmailConfigured = () => {
  return !!(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD
  );
};

const transporter = isEmailConfigured()
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

export async function sendVerificationOTP(
  email: string,
  otp: string,
  name: string,
) {
  // If email is not configured, log OTP to console for development
  if (!isEmailConfigured() || !transporter) {
    console.log("\n" + "=".repeat(50));
    console.log("📧 EMAIL NOT CONFIGURED - DEVELOPMENT MODE");
    console.log("=".repeat(50));
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`\n🔐 VERIFICATION OTP: ${otp}`);
    console.log(`\n⏰ Valid for 1 minute`);
    console.log("=".repeat(50) + "\n");
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: "Verify Your Email - ManageX",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .otp-box { 
              background: #f4f4f4; 
              border: 2px dashed #3b82f6; 
              border-radius: 8px; 
              padding: 30px; 
              text-align: center; 
              margin: 20px 0; 
            }
            .otp-code { 
              font-size: 36px; 
              font-weight: bold; 
              letter-spacing: 8px; 
              color: #3b82f6; 
              font-family: monospace; 
            }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ManageX, ${name}!</h1>
              <p>Please verify your email address using the code below:</p>
            </div>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">This code will expire in 1 minute</p>
            </div>
            
            <p style="text-align: center; color: #666;">
              Enter this code on the verification page to complete your registration.
            </p>
            
            <div class="footer">
              <p>If you didn't create this account, please ignore this email.</p>
              <p>&copy; 2026 ManageX. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, devMode: false };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendResetPasswordEmail(
  email: string,
  token: string,
  name: string,
) {
  // If email is not configured, log token to console for development
  if (!isEmailConfigured() || !transporter) {
    console.log("\n" + "=".repeat(50));
    console.log("📧 EMAIL NOT CONFIGURED - DEVELOPMENT MODE");
    console.log("=".repeat(50));
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`\n🔑 PASSWORD RESET TOKEN: ${token}`);
    console.log(
      `\n🔗 Reset URL: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`,
    );
    console.log(`\n⏰ Valid for 1 hour`);
    console.log("=".repeat(50) + "\n");
    return { success: true, devMode: true };
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: "Reset Your Password - ManageX",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .content { background: #f9f9f9; border-radius: 8px; padding: 30px; margin: 20px 0; }
            .button { 
              display: inline-block;
              padding: 15px 40px; 
              background-color: #3b82f6; 
              color: white !important; 
              text-decoration: none; 
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            
            <div class="content">
              <p>Hi ${name},</p>
              <p>We received a request to reset your password for your ManageX account.</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p style="font-size: 12px; color: #666;">
                Or copy and paste this link into your browser:<br>
                <a href="${resetUrl}">${resetUrl}</a>
              </p>
            </div>
            
            <div class="warning">
              <strong>⏰ This link will expire in 1 hour.</strong><br>
              If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </div>
            
            <div class="footer">
              <p>&copy; 2026 ManageX. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, devMode: false };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send reset password email");
  }
}
