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
      <h2>Email Verification</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${link}">Verify Email</a>
    `,
  });

  return true;
}
