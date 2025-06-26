'use client';

import Script from 'next/script';
import Navigation from "./utlty/navigation";
import { useEffect, useState } from "react";

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
      <div id="navbar" className="bg-amber-300 w-screen fixed z-9999 overflow-hidden">
        <Navigation />
      </div>

      <div className="bg-white text-black h-screen" style={{ paddingTop: `${navHeight}px` }}>
        {children}
      </div>
    </>
  );
}
