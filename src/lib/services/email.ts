import logger from "@/lib/logger";
import { siteConfig } from "@/lib/site";

type EmailOptions = { to: string; subject: string; text?: string; html?: string };

export async function sendEmail(opts: EmailOptions) {
  // Try to dynamically load nodemailer if available; otherwise fallback to logging.
  try {
    const nodemailer = await import("nodemailer");
    const transportOptions = process.env.SMTP_URL
      ? { url: process.env.SMTP_URL }
      : {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
          secure: process.env.SMTP_SECURE === "true",
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        };

    const transporter = nodemailer.createTransport(transportOptions as any);
    await transporter.sendMail({ from: process.env.EMAIL_FROM || siteConfig.email, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html });
    logger.info("email sent", { to: opts.to });
  } catch (err) {
    // nodemailer may not be installed in this environment; fallback to logging the message.
    logger.warn("sendEmail fallback - log only", { err: String(err), to: opts.to });
    logger.info("email payload", { to: opts.to, subject: opts.subject });
  }
}
