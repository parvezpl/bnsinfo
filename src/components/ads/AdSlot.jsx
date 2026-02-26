'use client';

import { useEffect, useRef } from "react";

export default function AdSlot({
  slot = "",
  className = "",
  label = "Sponsored",
  format = "auto",
  fullWidthResponsive = true,
}) {
  const pushedRef = useRef(false);
  const normalizedSlot = String(slot || "").trim();

  useEffect(() => {
    if (!normalizedSlot || pushedRef.current) return;
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch {}
  }, [normalizedSlot]);

  if (!normalizedSlot) return null;

  return (
    <div className={className}>
      {label ? (
        <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 6 }}>
          {label}
        </div>
      ) : null}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7440927056234503"
        data-ad-slot={normalizedSlot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
