'use client';

import { useEffect, useState } from "react";

export default function Page() {
  const [legalData, setLegalData] = useState([]);
  useEffect(() => {
    const fetchdata= async () => {
      try {
        const res = await fetch('/api/bns/bnsen');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const legal = await res.json();
        setLegalData(legal.bns );
      } catch (error) {
        console.error("Error fetching legal data:", error);
      }
    };
    fetchdata();
  },[])
  console.log("Fetched legal data:", legalData);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Legal Sections</h1>
      {legalData.map((item) => (
        item.sections && item.sections.map((section, index) => (
          <div key={index} className="border p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">{section.section}</h2>
          <div dangerouslySetInnerHTML={{ __html: section.section_title }} />
        </div>
        ))
      ))}
    </div>
  );
}
