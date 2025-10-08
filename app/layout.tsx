import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggle } from "@/components/theme-toggle";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://trip-vote.vercel.app"),
  title: {
    default: "Trip Vote - Decide Your Next Travel Destination Together",
    template: "%s | Trip Vote",
  },
  description:
    "Collaborative voting app to help groups decide their next travel destination. Create a vote session, invite friends, and discover your perfect travel spot together with real-time voting and ranking.",
  keywords: [
    "travel voting",
    "group travel",
    "destination picker",
    "travel planner",
    "collaborative voting",
    "trip planning",
    "group decision",
    "travel democracy",
    "vacation voting",
    "destination selector",
  ],
  authors: [{ name: "Trip Vote" }],
  creator: "Trip Vote",
  publisher: "Trip Vote",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Trip Vote",
    title: "Trip Vote - Decide Your Next Travel Destination Together",
    description:
      "Collaborative voting app to help groups decide their next travel destination. Create sessions, invite friends, and vote together in real-time.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trip Vote - Group Travel Decision Making",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip Vote - Decide Your Next Travel Destination Together",
    description:
      "Collaborative voting app to help groups decide their next travel destination. Create sessions, invite friends, and vote together in real-time.",
    images: ["/og-image.png"],
    creator: "@tripvote",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Trip Vote",
                description:
                  "Collaborative voting app to help groups decide their next travel destination together",
                url: process.env.NEXT_PUBLIC_APP_URL || "https://trip-vote.vercel.app",
                applicationCategory: "TravelApplication",
                operatingSystem: "Web Browser",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "5",
                  ratingCount: "1",
                },
                featureList: [
                  "Create collaborative vote sessions",
                  "Real-time voting and results",
                  "Interactive world map selection",
                  "Ranking system for preferences",
                  "Share results with groups",
                  "Dark mode support",
                ],
              }),
            }}
          />
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
