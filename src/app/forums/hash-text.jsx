import React from "react";

function getHashHref(tag) {
  const clean = String(tag || "").trim().replace(/^#+/, "");
  if (!clean) return "#";
  if (/^\d+$/.test(clean)) {
    return `/bns/mainpage?section=${encodeURIComponent(clean)}`;
  }
  return `/forums?tag=${encodeURIComponent(clean)}`;
}

export default function HashText({ text = "", className = "" }) {
  const value = String(text || "");
  const parts = [];
  const regex = /#([A-Za-z0-9_\u0900-\u097F-]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(value)) !== null) {
    const start = match.index;
    const end = regex.lastIndex;
    const tag = match[1];

    if (start > lastIndex) {
      parts.push(value.slice(lastIndex, start));
    }

    parts.push(
      <a key={`${tag}-${start}`} href={getHashHref(tag)} className="hash-link">
        #{tag}
      </a>
    );

    lastIndex = end;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}

