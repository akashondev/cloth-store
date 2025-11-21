import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function VerifyEmail(email, token) {
  const link = `${process.env.CLIENT_URL}/verify/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Styllin" <${process.env.EMAIL}>`,
    to: ["akashvish802@gmail.com"],
    subject: "Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px;">
                <!-- Header -->
                <tr>
                  <td style="background-color: #667eea; padding: 40px 20px; text-align: center;">
                    <h1 style="font-family: 'Caveat', cursive; font-size: 48px; color: #ffffff; margin: 0; font-weight: 700;">Styllin</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Welcome to Styllin!</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Thanks for signing up. We're excited to have you on board. To get started, please verify your email address by clicking the button below.</p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 10px 0;">
                          <a href="${link}" style="display: inline-block; padding: 16px 40px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Divider -->
                    <div style="height: 1px; background-color: #eeeeee; margin: 30px 0;"></div>
                    
                    <p style="font-size: 14px; color: #999999; margin: 0;">
                      If the button doesn't work, copy and paste this link into your browser:<br>
                      <a href="${link}" style="color: #667eea; word-break: break-all;">${link}</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; text-align: center; background-color: #f9f9f9; border-top: 1px solid #eeeeee;">
                    <p style="color: #999999; font-size: 14px; margin: 5px 0;">This email was sent to ${email}</p>
                    <p style="color: #999999; font-size: 14px; margin: 5px 0;">If you didn't create an account, you can safely ignore this email.</p>
                    <p style="color: #999999; font-size: 14px; margin: 20px 0 5px 0;">&copy; 2024 Styllin. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

  return true;
}
