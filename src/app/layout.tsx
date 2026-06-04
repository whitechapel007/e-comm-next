import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eboya Boi — Kaftans, Agbada, Shirts & More | Akoka, Lagos",
    template: "%s | Eboya Boi",
  },
  description:
    "Shop Kaftans, Agbada, Shirts, 2-Piece sets & Casualwear tailored beyond ordinary. Rediscover your fashion story with Eboya Boi — Akoka, Lagos Nigeria.",
  keywords: ["Kaftan", "Agbada", "Nigerian fashion", "Akoka", "Lagos", "tailored clothes", "2-piece", "casualwear", "Eboya Boi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://js.paystack.co/v2/inline.js"
          strategy="afterInteractive"
        />
        <Providers>
          <Toaster position="top-right" />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
