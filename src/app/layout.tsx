import type { Metadata } from "next";
import { Lexend, Merriweather } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdminGuard } from "@/components/layout/AdminGuard";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/site";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} | ${siteConfig.productName}`,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
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
      </body>
    </html>
  );
}
