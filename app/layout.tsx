import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DealsHub - Best Deals & Discounts",
  description: "Best products from eBay at discounted prices - Shop and earn with Affiliate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
        
        {/* eBay Partner Network Tracking Script */}
        <Script id="epn-config" strategy="afterInteractive">
          {`window._epn = {campaign: 5338903178};`}
        </Script>
        <Script 
          src="https://epnt.ebay.com/static/epn-smart-tools.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
