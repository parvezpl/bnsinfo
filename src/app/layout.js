import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./utlty/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BNS INFO",
  description: "POWERED BY HELIUSDEV",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation className={"fixed"}/>
        {children}
      </body>
    </html>
  );
}
