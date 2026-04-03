import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ChatbotBubble } from "@/components/ChatbotBubble";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SignLearn - Learn Sign Language with AI",
  description: "A comprehensive platform to learn sign language with real-time gesture translation, AI-powered lessons, and interactive practice tools.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#58cc02" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <ChatbotBubble />
      </body>
    </html>
  );
}
