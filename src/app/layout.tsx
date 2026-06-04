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
  title: "Eboya Boi — Fashion Tailored Beyond Ordinary | Akoka, Lagos",
  description:
    "Kaftans, Agbadas, shirts, 2-pieces & casualwears tailored beyond ordinary. Rediscover your fashion story with Eboya Boi, Akoka Lagos Nigeria.",
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
