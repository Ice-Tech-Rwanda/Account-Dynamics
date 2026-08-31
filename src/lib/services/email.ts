import logger from "@/lib/logger";
import { siteConfig } from "@/lib/site";

type EmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  /** Optional .ics calendar invite content. */
  calendar?: string;
};

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
    const attachments = opts.calendar
      ? [
          {
            filename: "booking.ics",
            content: opts.calendar,
            contentType: "text/calendar; charset=utf-8; method=REQUEST",
          },
        ]
      : undefined;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || siteConfig.email,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html ?? opts.text?.replace(/\n/g, "<br/>"),
      attachments,
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

// ---------------------------------------------------------------------------
// Booking confirmation
// ---------------------------------------------------------------------------

export type BookingConfirmationData = {
  email: string;
  name: string;
  service: string;
  date: string; // ISO "YYYY-MM-DD"
  time: string; // e.g. "10:00 AM – 11:00 AM"
  meetingType?: "in-person" | "virtual" | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build a bookable time (start) from a slot label and date.
 * Returns the start Date for ICS, or null if it can't be parsed.
 */
function slotStartDate(dateIso: string, timeLabel: string): Date | null {
  const match = timeLabel.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  const d = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(hours, parseInt(match[2], 10), 0, 0);
  return d;
}

function buildIcs(data: BookingConfirmationData): string {
  const start = slotStartDate(data.date, data.time);
  const now = new Date();
  const fmt = (dt: Date) =>
    dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const dtStart = start ? fmt(start) : fmt(now);
  const dtEnd = start
    ? fmt(new Date(start.getTime() + 60 * 60 * 1000))
    : fmt(new Date(now.getTime() + 60 * 60 * 1000));

  const summary = `Account Dynamics consultation — ${data.service}`;
  const location = "Account Dynamics, 55 Baywood Road, 2nd Floor, Toronto, ON";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Account Dynamics//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:booking-${now.getTime()}@accountdynamics.ca`,
    `DTSTAMP:${fmt(now)}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:Consultation with ${data.name} (${data.service}).`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function bookingHtml(data: BookingConfirmationData, isTentative: boolean): string {
  const dateLabel = new Date(`${data.date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return [
    "<div style='font-family:Arial,Helvetica,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;'>",
    "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background:#0A1F45;border-radius:12px 12px 0 0;padding:28px 32px;'>",
    "<tr><td style='color:#D9FF3A;font-size:22px;font-weight:bold;'>Account Dynamics</td></tr>",
    "<tr><td style='color:#ffffff;font-size:13px;opacity:.85;padding-top:4px;'>Accounting · Tax · Advisory · Toronto, Canada</td></tr>",
    "</table>",
    "<div style='border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:32px;background:#ffffff;'>",
    `<h2 style='margin:0 0 12px;font-size:18px;'>Booking ${isTentative ? "Request Received" : "Confirmed"} — ${escapeHtml(data.service)}</h2>`,
    `<p style='margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;'>Hi ${escapeHtml(data.name)},</p>`,
    `<p style='margin:0 0 24px;font-size:14px;line-height:1.6;color:#475569;'>`,
    isTentative
      ? "Thank you for requesting a consultation. We've reserved your preferred slot and will finalize it with you within one business day."
      : "Great news — your consultation has been confirmed. We look forward to meeting you.",
    "</p>",
    "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;'>",
    `<tr><td style='font-size:12px;color:#64748b;padding:4px 0;'>DATE</td></tr>`,
    `<tr><td style='font-size:15px;font-weight:600;color:#0f172a;padding:0 0 14px;'>${escapeHtml(dateLabel)}</td></tr>`,
    `<tr><td style='font-size:12px;color:#64748b;padding:4px 0;'>TIME</td></tr>`,
    `<tr><td style='font-size:15px;font-weight:600;color:#0f172a;padding:0 0 14px;'>${escapeHtml(data.time)}</td></tr>`,
    `<tr><td style='font-size:12px;color:#64748b;padding:4px 0;'>LOCATION</td></tr>`,
    `<tr><td style='font-size:15px;font-weight:600;color:#0f172a;'>in-person or virtual — we'll confirm</td></tr>`,
    "</table>",
    "<p style='margin:24px 0 0;font-size:14px;line-height:1.6;color:#475569;'>If anything changes, just reply to this email or call us. See you soon!</p>",
    "<p style='margin:28px 0 0;font-size:13px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px;'>Warm regards,<br/>The Account Dynamics Team<br/><span style='color:#64748b;'>${escapeHtml(siteConfig.phone)} · ${escapeHtml(siteConfig.email)}</span></p>",
    "</div>",
    "</div>",
  ].join("");
}

function bookingText(data: BookingConfirmationData, isTentative: boolean): string {
  const dateLabel = new Date(`${data.date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const header = isTentative ? "Booking request received" : "Booking confirmed";
  return [
    `${siteConfig.name} — ${header}`,
    "",
    `Service: ${data.service}`,
    `Date:    ${dateLabel}`,
    `Time:    ${data.time}`,
    "Location: in-person or virtual (we'll confirm)",
    "",
    isTentative
      ? `Hi ${data.name}, we've reserved this slot and will finalize it with you within one business day.`
      : `Hi ${data.name}, your consultation is confirmed. We look forward to seeing you.`,
    "",
    "A calendar invite is attached. If anything changes, just reply to this email or call us.",
    "",
    `Warm regards,`,
    siteConfig.name,
    siteConfig.phone,
    siteConfig.email,
  ].join("\n");
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  const isTentative = true; // consultations are confirmed by our team within 1 business day
  await sendEmail({
    to: data.email,
    subject: `Booking request received — ${data.service}`,
    text: bookingText(data, isTentative),
    html: bookingHtml(data, isTentative),
    calendar: buildIcs(data),
  });
}