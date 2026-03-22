import { google } from "googleapis";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import {
  generateVerificationHTMLTemplate,
  generateVerificationTextTemplate,
  generateVerifiedHTMLTemplate,
  generateVerifiedTextTemplate,
} from "../utils/emailTemplates.js";

// ── OAuth2 client setup ──
const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
  refresh_token: config.GOOGLE_REFRESH_TOKEN,
});

// ── Build RFC-2822 raw email for Gmail API ──
const buildRawEmail = (to, subject, html, text) => {
  const boundary = `boundary_nexora_${Date.now()}`;

  const lines = [
    `From: "Nexora" <${config.GOOGLE_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    ``,
    text || "",
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    ``,
    html || "",
    ``,
    `--${boundary}--`,
  ];

  return Buffer.from(lines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// ── Core send utility ──
const sendEmail = async (to, subject, html, text) => {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const raw = buildRawEmail(to, subject, html, text);

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return response.data.id;
};

// ── Generate a signed JWT verification link ──
const generateVerificationLink = (email) => {
  const token = jwt.sign(
    { email, purpose: "email-verification" },
    config.JWT_SECRET,
    { expiresIn: "24h" },
  );

  return `${config.FRONTEND_URL}/verify?token=${token}`;
};

const sendVerificationEmail = async (to) => {
  const subject = "Verify your email - Nexora";
  const verificationLink = generateVerificationLink(to);

  try {
    const messageId = await sendEmail(
      to,
      subject,
      generateVerificationHTMLTemplate(verificationLink),
      generateVerificationTextTemplate(verificationLink),
    );
    console.log(`[Email] Verification link sent to ${to} | id: ${messageId}`);
  } catch (error) {
    console.error(
      `[Email] Failed to send verification email to ${to}:`,
      error.message,
    );
    throw new Error("Failed to send verification email. Please try again.");
  }
};

// ── Sent after user successfully verifies: confirmed + login link
const sendVerifiedEmail = async (to) => {
  const subject = "Your email has been verified - Nexora";
  const loginLink = `${config.FRONTEND_URL}/login`;

  try {
    const messageId = await sendEmail(
      to,
      subject,
      generateVerifiedHTMLTemplate(loginLink),
      generateVerifiedTextTemplate(loginLink),
    );
    console.log(
      `[Email] Verified confirmation sent to ${to} | id: ${messageId}`,
    );
  } catch (error) {
    console.error(
      `[Email] Failed to send verified email to ${to}:`,
      error.message,
    );
    throw new Error("Failed to send confirmation email. Please try again.");
  }
};

export { sendVerificationEmail, sendVerifiedEmail };
