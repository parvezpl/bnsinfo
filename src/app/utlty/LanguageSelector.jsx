"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const LanguageSelector = ({setLanguages}) => {
  const [language, setLanguage] = useState("hi");
  const params = useParams()
  useEffect(()=>{
    setLanguage(params.lang)
  },[])

  const handleChange = async (e) => {
    console.log("Language changed to:", e.target.value);
    setLanguage(e.target.value);
    setLanguages(e.target.value)
  };

  return (
    <div className="w-fit text-[10px] sm:text-[12px] ">
      <select
        value={language}
        onChange={handleChange}
        className="w-full px-0.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        // defaultValue="hi"
      >
        <option >Language</option>
        <option value="hi" >हिन्दी (Hindi)</option>
        <option value="en" >English</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
