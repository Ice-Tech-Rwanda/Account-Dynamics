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
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || siteConfig.email,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html ?? opts.text?.replace(/\n/g, "<br/>"),
    });
    logger.info("email sent", { to: opts.to });
  } catch (err) {
    logger.warn("sendEmail fallback - log only", { err: String(err), to: opts.to });
    logger.info("email payload", { to: opts.to, subject: opts.subject });
  }
}

type LeadMailData = {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  type: "inquiry" | "quote" | "consultation";
  createdAt: Date;
  message?: string | null;
  extra?: Record<string, string | null | undefined>;
};

function textForLine(label: string, value?: string | null): string {
  const v = value?.trim();
  return v ? `${label}: ${v}\n` : "";
}

export async function notifyAdminOfLead(data: LeadMailData, adminEmail: string) {
  const labels: Record<LeadMailData["type"], string> = {
    inquiry: "New Website Inquiry",
    quote: "New Quote Request",
    consultation: "New Consultation Request",
  };

  let text = `${labels[data.type]} — ${data.service || "General"}\n\n`;
  text += textForLine("Name", data.name);
  text += textForLine("Email", data.email);
  text += textForLine("Phone", data.phone);
  text += textForLine("Company", data.company);
  text += textForLine("Service", data.service);
  if (data.extra) {
    for (const [key, value] of Object.entries(data.extra)) {
      if (value) text += textForLine(key, value);
    }
  }
  text += textForLine("Date", data.createdAt.toLocaleString());
  const msg = data.message?.trim();
  if (msg) text += `\nMessage:\n${msg}\n`;

  await sendEmail({
    to: adminEmail,
    subject: `${labels[data.type]} — ${data.service || "Website"}`.slice(0, 140),
    text,
  });
}

export async function sendLeadConfirmation(email: string, type: LeadMailData["type"], preferredContact?: string | null) {
  const subjects: Record<LeadMailData["type"], string> = {
    inquiry: "Thank you for contacting Account Dynamics",
    quote: "Thank you for requesting a quote",
    consultation: "Thank you for booking a consultation",
  };

  const text = [
    `Dear Account Dynamics client,`,
    ``,
    `Thank you for reaching out. We have received your ${type === "inquiry" ? "message" : type === "quote" ? "quote request" : "consultation request"} and our team will get back to you within one business day.`,
    preferredContact === "phone"
      ? `We will contact you by phone.`
      : `We will respond to your inquiry by email.`,
    ``,
    `Warm regards,`,
    siteConfig.name,
    siteConfig.phone,
    siteConfig.location,
  ].join("\n");

  await sendEmail({
    to: email,
    subject: subjects[type],
    text,
  });
}

export async function replyToCustomer(options: { to: string; subject: string; body: string }) {
  await sendEmail({
    to: options.to,
    subject: options.subject,
    text: options.body,
  });
}