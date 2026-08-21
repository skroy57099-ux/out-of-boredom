import type { Metadata, Viewport } from "next";
import Script from "next/script";

import {
  Geist,
  Geist_Mono,
  JetBrains_Mono,
} from "next/font/google";

import "./globals.css";

import BoreFloating from "@/components/BORE/UI/BoreFloating";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BORE",
  description:
    "Learn Data Analytics through interactive playgrounds.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${jetbrainsMono.variable}
        h-full
        antialiased
      `}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#050505] text-[#ededed]">
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js"
          strategy="afterInteractive"
        />

        {children}

        <BoreFloating />
      </body>
    </html>
  );
}