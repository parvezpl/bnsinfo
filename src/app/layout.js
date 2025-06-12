import { Geist, Geist_Mono } from "next/font/google";
import Head from 'next/head';
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
<Head>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7440927056234503"
     crossorigin="anonymous"></script>
</Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation className={"fixed w-screen"}/>
        <div className="pt-[201px] sm:pt[213px] md:pt-[183px] xl:pt-[145.5px] ">
        {children}
        </div>
      </body>
    </html>
  );
}
