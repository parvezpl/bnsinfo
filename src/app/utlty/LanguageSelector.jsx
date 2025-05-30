"use client";

import { useState } from "react";

const LanguageSelector = ({setLanguages}) => {
  const [language, setLanguage] = useState("hi");

  const handleChange = (e) => {
    setLanguages(e.target.value)
    setLanguage(e.target.value);
    
    console.log("Selected Language:", e.target.value);
  };

  return (
    <div className="w-fit text-[12px]">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Select Language
      </label>
      <select
        value={language}
        onChange={handleChange}
        className="w-full px-0.5 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="hi">हिन्दी (Hindi)</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
