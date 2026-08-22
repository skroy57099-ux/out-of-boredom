import type { Metadata } from "next";
import Script from "next/script";

import {
  Geist,
  Geist_Mono,
  JetBrains_Mono,
} from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

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
      <body className="h-full">
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js"
          strategy="afterInteractive"
        />

        {children}

        <BoreFloating />

        <Analytics />
      </body>
    </html>
  );
}