import type { Metadata } from "next";
import Image from "next/image";
import { Newsreader as NewsreaderFont, Inter as InterFont } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const newsreader = NewsreaderFont({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

const inter = InterFont({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PredLife — Explore Your Longevity",
  description: "A personalized assessment of evidence-informed factors associated with healthy longevity. Pay ₹199 to unlock your longevity profile and 30-day improvement plan.",
  keywords: ["longevity", "health assessment", "cardiovascular health", "life expectancy estimate", "AHA Lifes Essential 8"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col justify-between selection:bg-[var(--accent-primary)] selection:text-white bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <header className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-xs sticky top-0 z-40 transition-colors">
          <div className="editorial-container py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 rounded-sm overflow-hidden flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="PredLife Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-serif-editorial text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Pred<span className="text-[var(--accent-primary)]">Life</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-[var(--border-color)] rounded-full text-[var(--text-muted)] bg-[var(--bg-subtle)] hidden sm:inline">
                PL-1.0
              </span>
            </a>

            <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-[var(--text-secondary)]">
              <a href="/methodology" className="hover:text-[var(--text-primary)] transition-colors">
                Methodology
              </a>
              <a href="/medical-disclaimer" className="hover:text-[var(--text-primary)] transition-colors hidden sm:inline">
                Disclaimer
              </a>
              <ThemeToggle />
              <a
                href="/checkout"
                className="bg-[var(--accent-primary)] text-white text-xs font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-all shadow-2xs"
              >
                Start — ₹199
              </a>
            </nav>
          </div>
        </header>

        <main className="grow">{children}</main>

        <footer className="border-t border-[var(--border-color)] bg-[var(--bg-subtle)] py-12 text-xs text-[var(--text-muted)] transition-colors">
          <div className="editorial-container space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className="relative w-7 h-7 rounded-sm overflow-hidden flex items-center justify-center shrink-0 mt-1">
                  <Image
                    src="/logo.png"
                    alt="PredLife Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-serif-editorial text-lg font-bold text-[var(--text-primary)]">PredLife</span>
                  <p className="text-[var(--text-secondary)] mt-0.5 max-w-xl">
                    Evidence-informed longevity risk profiling based on AHA Life’s Essential 8 and WHO cardiovascular health constructs.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-[var(--text-secondary)]">
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <a href="/terms" className="hover:underline">Terms of Service</a>
                <a href="/refund-policy" className="hover:underline">Refund Policy</a>
                <a href="/medical-disclaimer" className="hover:underline">Medical Disclaimer</a>
                <a href="/contact" className="hover:underline">Contact Support</a>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-color)] text-[11px] leading-relaxed text-[var(--text-muted)]">
              <p>
                <strong>Educational & Statistical Notice:</strong> PredLife provides an educational longevity risk assessment based on user-supplied information. It does NOT predict an exact date or age of death, diagnose medical conditions, provide medical treatment, or guarantee lifespan extension. Consult a qualified healthcare professional for medical advice.
              </p>
              <p className="mt-2">
                © {new Date().getFullYear()} PredLife Health Inc. All rights reserved. Methodology Version PL-1.0.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
