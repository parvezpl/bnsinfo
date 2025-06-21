'use client'
import React from 'react'

export default function Makejeson() {
  const [bnsData, setBnsData] = React.useState([])
  const data = [
    {
      chapter: "1",
      chapter_title: "BNS Documentation",
      sections: [
        {
          section: "Section 1",
          section_title: "BNS is a decentralized naming system that allows users to register human-readable names for their blockchain addresses."
        },
        {
          section: "Section 2",
          section_title: "To register a name, users need to follow the registration process outlined in the BNS documentation."
        }
      ]
    },
    {
      chapter: "2",
      chapter_title: "BNS Documentation",
      sections: [
        {
          section: "Section 3",
          section_title: "BNS is a decentralized naming system that allows users to register human-readable names for their blockchain addresses."
        },
        {
          section: "Section 5",
          section_title: "To register a name, users need to follow the registration process outlined in the BNS documentation."
        }
      ]
    },
    {
      chapter: "4",
      chapter_title: "BNS Documentation",
      sections: [
        {
          section: "Section 4",
          section_title: "BNS is a decentralized naming system that allows users to register human-readable names for their blockchain addresses."
        },
        {
          section: "Section 6",
          section_title: "To register a name, users need to follow the registration process outlined in the BNS documentation."
        },
        {
          section: "Section 7",
          section_title: "To register a name, users need to follow the registration process outlined in the BNS documentation."
        }
      ]
    }

  ]

const translate = async (text) => {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Translation failed:', data.error);
    return text; // fallback to original text
  }

  return data.translatedText;
};


  const fetchData = async () => {
    const res = await fetch('/api/bns/bnsen');
    const json = await res.json();
    return json.bns;
  };

  
  
  // const [sections, setSections] = React.useState([]);
  const [chapterss, setChapter] = React.useState([])
  const handleTranslate = async () => {
    let chapters = [];
    chapters = [];
    const bnsData = await fetchData();
    // const bnsDatas = [bnsData[0]]
    console.log('bnsData', bnsData);
    bnsData.forEach(async (chapter) => {
      const translatedChapter = await translate(chapter.chapter);
      const translatedChapter_title = await translate(chapter.chapter_title);
      let sections = [];
      chapter.sections.forEach(async (section) => {
        const translatedSection = await translate(section.section);
        const cleaned = section.section_title.replace(/\\n\\n/g, '\n') // remove double line breaks
                   .replace(/\\n/g, ' ')      // replace remaining \n with space
                   .replace(/\s+/g, ' ')      // normalize extra spaces
                   .trim();
        const translatedSection_content = await translate(cleaned);
        console.log('translatedSection', translatedSection_content);
        sections.push({
          section: translatedSection,
          section_content: translatedSection_content
        });
      });
      chapters.push({
        chapter: translatedChapter,
        chapter_title: translatedChapter_title,
        sections: sections
      });
      
    });
  console.log('bnsData', chapters);
  setChapter(chapters);
  };

  const saveJson = async (data) => {
    const res = await fetch('/api/savejson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bnsdata: data }),
    });

    const result = await res.json();
    console.log('result', result);
  }

  return (
    <div>

      <button className='mt-4 bg-green-600 text-black px-4 py-2 rounded'
        onClick={handleTranslate}
      >
        make json
      </button>
      <button className='mt-4 bg-green-600 text-black px-4 py-2 rounded'
        onClick={async () => {
          await saveJson(chapterss);
        }}
      > 
        fetch data
      </button>
    </div>
  )
}
