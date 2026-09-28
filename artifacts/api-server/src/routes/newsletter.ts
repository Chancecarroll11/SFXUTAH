import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";

const router: IRouter = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

router.post("/newsletter", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";

  if (!email || !emailPattern.test(email)) {
    res.status(400).json({ error: "A valid email address is required" });
    return;
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.error("Email credentials not configured");
    res.status(500).json({ error: "Email not configured" });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  const safeEmail = escapeHtml(email);

  try {
    await transporter.sendMail({
      from: `"SFX Utah Newsletter" <${gmailUser}>`,
      to: "chancecarroll07@gmail.com",
      replyTo: email,
      subject: "[SFX Utah] New newsletter signup",
      text: `New SFX Utah newsletter signup: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background: #0e0e0e; color: #f2ede8; padding: 40px; border-radius: 4px;">
          <div style="border-bottom: 2px solid #FF1EAD; padding-bottom: 20px; margin-bottom: 28px;">
            <h1 style="font-size: 28px; margin: 0; color: #FF1EAD; letter-spacing: 2px;">SFX UTAH</h1>
            <p style="margin: 4px 0 0; color: #888; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">New Newsletter Signup</p>
          </div>
          <p style="font-size: 14px; color: #888; letter-spacing: 1px; text-transform: uppercase;">Email Address</p>
          <p style="font-size: 20px; margin: 8px 0 0;">
            <a href="mailto:${safeEmail}" style="color: #FF1EAD;">${safeEmail}</a>
          </p>
          <p style="margin-top: 32px; font-size: 12px; color: #555;">Sent via the SFX Utah website newsletter form</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to send newsletter signup email:", error);
    res.status(500).json({ error: "Failed to send newsletter signup" });
  }
});

export default router;