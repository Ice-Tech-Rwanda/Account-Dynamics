"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, ExternalLink } from "lucide-react";

interface ContactInfo {
  email: string
  phone: string
  address: string
  whatsapp: string
  socialLinks?: Record<string, string>
}

export function ContactSection({ contactInfo }: { contactInfo: ContactInfo }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<null | { type: "success" | "error"; text: string }>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatusMsg({ type: 'error', text: err?.message || 'Failed to send message' });
      } else {
        setStatusMsg({ type: 'success', text: 'Message sent — we will get back to you soon.' });
        setName(''); setEmail(''); setSubject(''); setMessage('');
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error — please try again later.' });
    } finally {
      setSending(false);
    }
  }

  const contactCards = [
    {
      icon: Mail,
      label: "Email Us",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      gradient: "from-blue-500 to-blue-600",
      darkGradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone}`,
      gradient: "from-brand to-emerald-600",
      darkGradient: "from-brand/20 to-emerald-600/20",
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: contactInfo.address,
      href: `https://www.google.com/maps/search/${encodeURIComponent(contactInfo.address)}`,
      gradient: "from-accent to-amber-600",
      darkGradient: "from-accent/20 to-amber-600/20",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+250 700 000 000",
      href: contactInfo.whatsapp,
      gradient: "from-green-500 to-green-600",
      darkGradient: "from-green-500/20 to-green-600/20",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Contact</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Get in Touch
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Have a question or want to get involved? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {contactCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.label}
                href={card.href}
                target={card.label === "Email Us" || card.label === "Call Us" ? undefined : "_blank"}
                rel={card.label === "Email Us" || card.label === "Call Us" ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.darkGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg mb-4`}>
                    <Icon className="size-4 sm:size-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                    {card.label}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {card.value}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {card.label === "WhatsApp" ? "Chat Now" : "Open"} <ExternalLink className="size-3" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-lg"
        >
          <div className="aspect-[21/9] w-full bg-slate-200 dark:bg-slate-800 relative">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
              className="absolute inset-0"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <motion.a
            href={contactInfo.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="size-4" />
            Chat with Us on WhatsApp
          </motion.a>
        </motion.div>
        <div className="max-w-3xl mx-auto mt-12">
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="sr-only" htmlFor="contact-name">Name</label>
              <input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="sr-only" htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required className="w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="sr-only" htmlFor="contact-subject">Subject</label>
              <input id="contact-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required className="w-full rounded-md border px-3 py-2" />
            </div>
            <div className="sm:col-span-2">
              <label className="sr-only" htmlFor="contact-message">Message</label>
              <textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" required rows={5} className="w-full rounded-md border px-3 py-2" />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between gap-4">
              <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2 text-sm font-bold text-white disabled:opacity-60">
                {sending ? 'Sending…' : 'Send Message'}
              </button>
              <div aria-live="polite" className="text-sm">
                {statusMsg && (
                  <span className={statusMsg.type === 'success' ? 'text-emerald-600' : 'text-red-600'}>{statusMsg.text}</span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
