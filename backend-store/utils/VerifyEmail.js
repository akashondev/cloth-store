import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { env } from "./env.js";
dotenv.config();

export async function VerifyEmail(email, token) {
  const link = `${env("CLIENT_URL", "http://localhost:3001")}/verify/${token}`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: env("EMAIL"),
        pass: env("EMAIL_PASS"),
      },
    });

    await transporter.sendMail({
      from: `"Styllin" <${env("EMAIL")}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet" />
</head>

<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f8f8f8;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:50px 20px;">
    <tr>
      <td align="center">

        <table width="520" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06);">

          <tr>
            <td style="padding:40px 20px 20px; text-align:center;">
              <h1 style="font-family:'Caveat', cursive; font-size:42px; margin:0; color:#0D9488;">Styllin</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 30px; text-align:center;">
              <h2 style="font-size:24px; margin:0 0 18px; font-weight:600; color:#222;">Verify Your Email</h2>

              <p style="font-size:15px; color:#555; line-height:1.6; margin:0 0 32px;">
                Thanks for joining Styllin. Confirm your email to unlock your account and start exploring new arrivals, exclusive drops, and premium styles.
              </p>

              <table cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="border-radius:8px; background:#0D9488;">
                    <a href="${link}" style="display:inline-block; padding:14px 36px; font-size:15px; color:#ffffff; text-decoration:none; font-weight:600;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px; color:#999; margin:20px 0 8px;">Or copy and paste this link:</p>

              <p style="font-size:13px; margin:0;">
                <a href="${link}" style="color:#0D9488; text-decoration:none;">Click here to verify</a>
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:28px 20px; text-align:center; background:#fafafa;">
              <p style="font-size:13px; color:#999; margin:0 0 4px;">Sent to ${email}</p>
              <p style="font-size:13px; color:#999; margin:0;">If you didn’t request this, simply ignore this email.</p>
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
  } catch (error) {
    console.error("Verification email failed:", error.message);
    return false;
  }
}
