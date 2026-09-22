import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";

const router: IRouter = Router();

router.post("/submit", async (req, res) => {
  const { name, email, instagram, genre, musicLink, city, message } = req.body;

  if (!name || !email || !genre || !musicLink || !city || !message) {
    res.status(400).json({ error: "Missing required fields" });
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

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; background: #0e0e0e; color: #f2ede8; padding: 40px; border-radius: 4px;">
      <div style="border-bottom: 2px solid #FF1EAD; padding-bottom: 20px; margin-bottom: 28px;">
        <h1 style="font-size: 28px; margin: 0; color: #FF1EAD; letter-spacing: 2px;">SFX UTAH</h1>
        <p style="margin: 4px 0 0; color: #888; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">New Music Submission</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; width: 140px;">Artist Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; font-size: 16px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; font-size: 16px;"><a href="mailto:${email}" style="color: #FF1EAD;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Genre</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; font-size: 16px;">${genre}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Location</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; font-size: 16px;">${city}</td>
        </tr>
        ${instagram ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Instagram</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; font-size: 16px;"><a href="https://instagram.com/${instagram}" style="color: #FF1EAD;">@${instagram}</a></td>
        </tr>` : ""}
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Music Link</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; font-size: 16px;"><a href="${musicLink}" style="color: #FF1EAD;">${musicLink}</a></td>
        </tr>
      </table>

      <div style="margin-top: 28px;">
        <p style="color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">About the Artist</p>
        <div style="background: #141414; border-left: 3px solid #FF1EAD; padding: 16px 20px; font-size: 15px; line-height: 1.7; color: #ccc; white-space: pre-wrap;">${message}</div>
      </div>

      <p style="margin-top: 32px; font-size: 12px; color: #555;">Sent via SFX Utah music submission form</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"SFX Utah" <${gmailUser}>`,
      to: "chancecarroll07@gmail.com",
      replyTo: email,
      subject: `[SFX Utah] Music Submission: ${name} (${genre}) from ${city}`,
      html,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to send email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
