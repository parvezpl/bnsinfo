// import ClientLayout from './client-layout';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from './SessionProviderWrapper';
import Navigation from "./utlty/navigation";
import ClientLayout from '../app/client-layout';
import { getSiteUrl } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BNS Info",
    template: "%s | BNS Info",
  },
  description: "Bharatiya Nyaya Sanhita (BNS) guides, legal explainers, and community updates.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "BNS Info",
    description: "Bharatiya Nyaya Sanhita (BNS) guides, legal explainers, and community updates.",
    siteName: "BNS Info",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "BNS Info",
    description: "Bharatiya Nyaya Sanhita (BNS) guides, legal explainers, and community updates.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
