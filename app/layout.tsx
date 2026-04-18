import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Koprindo Sistem Distribusi FOX",
  description: "Dashboard internal Koprindo untuk monitoring distribusi FOX 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} relative isolate overflow-x-hidden`}>
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-background">
          <video
            className="h-full w-full object-cover opacity-30"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/video-6.mp4" type="video/mp4" />
          </video>
        </div>
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,10,16,0.52),rgba(7,10,16,0.82)),radial-gradient(circle_at_top,rgba(242,140,56,0.14),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(77,163,255,0.12),transparent_22%)]"
        />
        {children}
      </body>
    </html>
  );
}
