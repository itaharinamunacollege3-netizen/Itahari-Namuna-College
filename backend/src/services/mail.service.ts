import nodemailer from "nodemailer";
import { env } from "../config/env";

export const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.warn("SMTP not configured. Skipping email to:", to);
    return;
  }

  try {
    const info = await mailer.sendMail({
      from: env.SMTP_FROM || `"Itahari Namuna College" <${env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`Email sent successfully to ${to} (Message ID: ${info.messageId})`);
  } catch (error: any) {
    console.error(`Failed to send email to ${to}:`, error.message);
    if (error.code === 'EAUTH') {
      console.error(
        "Authentication failed! If using Gmail, you MUST use an 'App Password', not your regular login password. " +
        "Go to Google Account -> Security -> 2-Step Verification -> App Passwords to generate one."
      );
    }
  }
}
