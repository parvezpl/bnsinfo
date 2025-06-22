'use client'
import { Geist, Geist_Mono } from "next/font/google";
import Head from 'next/head';
import "./globals.css";
import Navigation from "./utlty/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      setNavHeight(navbar.offsetHeight);
    }

    const handleResize = () => {
      if (navbar) setNavHeight(navbar.offsetHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <html lang="en">
      <Head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7440927056234503"
          crossorigin="anonymous"></script>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div id="navbar" className="bg-amber-300 w-screen fixed z-9999 overflow-hidden" >
          <Navigation />
        </div>
        {/* <div className="pt-[201px] sm:pt[213px] md:pt-[183px] xl:pt-[145.5px] bg-white text-black h-screen"> */}
        <div className=" bg-white text-black h-screen  " style={{ paddingTop: `${navHeight}px` }}>
          {children}
        </div>
      </body>
    </html>
  );
}
