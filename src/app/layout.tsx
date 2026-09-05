import type { Metadata } from "next";
import { Lexend, Merriweather } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdminGuard } from "@/components/layout/AdminGuard";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { Analytics } from "@/components/analytics/Analytics";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/site";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} | Tax, Cloud Accounting, Advisory & Business Analytics`,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${lexend.variable} ${merriweather.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AdminGuard>
            <Header />
          </AdminGuard>
          <main className="min-h-screen">{children}</main>
          <AdminGuard>
            <Footer />
          </AdminGuard>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        <FloatingWhatsApp />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? <Analytics /> : null}
      </body>
    </html>
  );
}
