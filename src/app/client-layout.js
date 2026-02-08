'use client';

import Script from 'next/script';
import Navigation from "./utlty/navigation";
import { useEffect, useState } from "react";
import "./client-layout.css";

export default function ClientLayout({ children }) {
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
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7440927056234503"
        crossOrigin="anonymous"
      />
      <div id="navbar" className="app-navbar">
        <Navigation />
      </div>

      <div
        className="app-shell"
        style={{ paddingTop: `${navHeight}px`, '--nav-height': `${navHeight}px` }}
      >
        {children}
      </div>
    </>
  );
}
