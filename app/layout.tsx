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
    <html lang="id" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} relative isolate overflow-x-hidden`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var theme=localStorage.getItem('koprindo-theme');if(theme!=='light'&&theme!=='dark'){theme='dark';}document.documentElement.dataset.theme=theme;document.documentElement.classList.add('theme-ready');}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.classList.add('theme-ready');}})();`,
          }}
        />
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-background">
          <video
            className="app-bg-video h-full w-full object-cover"
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
          className="app-video-overlay pointer-events-none fixed inset-0 -z-10"
        />
        {children}
      </body>
    </html>
  );
}
