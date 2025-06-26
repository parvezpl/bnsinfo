// components/TypingText.js
"use client";

import { useEffect, useState } from "react";

export default function TypingText({ text }) {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text.charAt(index));
                setIndex(index + 1);
            }, 20); // Speed of typing (adjust as needed)
            return () => clearTimeout(timeout);
        }
    }, [index, text]);

    return (
        <div className="whitespace-pre-line text-gray-700">
            {displayedText}
            <span className="animate-pulse">|</span> {/* Blinking cursor */}
        </div>
    );
}
