'use client';

import Script from 'next/script';
import Navigation from "./utlty/navigation";
import { useEffect, useState } from "react";
import "./client-layout.css";

export default function ClientLayout({ children }) {
  const [navHeight, setNavHeight] = useState(140);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const updateHeight = () => {
      const next = navbar.offsetHeight || 140;
      setNavHeight(next);
    };

    updateHeight();

    const observer = new ResizeObserver(() => updateHeight());
    observer.observe(navbar);

    const handleResize = () => {
      updateHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
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
        <footer className="app-footer">
          <p>
            <strong>Disclaimer:</strong> This is a non-governmental site created for educational purposes, aiming to simplify Bharatiya Nyaya Sanhita 2023 for easy understanding.
          </p>
        </footer>
      </div>
    </>
  );
}
