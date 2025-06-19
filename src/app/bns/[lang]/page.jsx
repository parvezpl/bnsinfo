// // app/legal/page.tsx
// 'use client';

// import { useEffect, useState } from "react";


// export default function LegalPage() {

//     const [chapters, setChapters] = useState([]);
//       useEffect(() => {
//         const fetchdata= async () => {
//           try {
//             const res = await fetch('/api/bns/bnsen');
//             if (!res.ok) {
//               throw new Error('Network response was not ok');
//             }
//             const legal = await res.json();
//             setChapters(legal.bns );
//           } catch (error) {
//             console.error("Error fetching legal data:", error);
//           }
//         };
//         fetchdata();
//       },[])



//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <nav className="w-72 bg-white shadow-md p-4">
//         <h2 className="text-xl font-bold mb-4">Chapters</h2>
//         <ul>
//           {chapters.map((chapter) => (
//             <li key={chapter.chapter} className="group relative">
//               <span className="block p-2 font-semibold cursor-pointer hover:bg-gray-200">
//                 {chapter.chapter}
//               </span>
//               {/* Section dropdown on hover */}
//               <ul className="absolute left-full top-0 z-10 hidden group-hover:block w-64 bg-white shadow-lg">
//                 {chapter.sections.slice(0, 5).map((sec, i) => (
//                   <li key={i} className="p-2 border-b hover:bg-gray-100 text-sm">
//                     {sec.section} {sec.section_title}
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <main className="flex-1 p-6 overflow-auto">
//         <h1 className="text-3xl font-bold mb-4">Legal Sections Viewer</h1>
//         {chapters.map((chapter) => (
//           <div key={chapter.chapter} className="mb-6">
//             <h2 className="text-xl font-semibold mb-2">{chapter.chapter}: {chapter.chapter_title}</h2>
//             {chapter.sections.map((sec, i) => (
//               <div key={i} className="mb-3 p-4 bg-white rounded shadow">
//                 <h3 className="font-semibold text-lg mb-1">{sec.section} {sec.section_title}</h3>
//                 <p className="text-gray-700 whitespace-pre-line">{sec.content}</p>
//               </div>
//             ))}
//           </div>
//         ))}
//       </main>
//     </div>
//   );
// }


'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react' // optional: for menu icon
import { useParams } from 'next/navigation'

export default function Page() {
  const [data, setData] = useState([])
  const [activeChapter, setActiveChapter] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lang = useParams().lang || 'en' // Default to 'en' if no lang param
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const res = lang === 'en' ? await fetch('/api/bns/bnsen') : await fetch('/api/bns/bnshindi/bnshi') // Adjust the API endpoint as needed
      const json = await res.json()
      setData(json.bns)
    }
    fetchData()
  }, [])

  const handleChapterClick = (chapterId) => {
    setActiveChapter(chapterId)
    setActiveSection(null)
    setMobileOpen(false) // close sidebar on mobile after click
  }

  const handleSectionClick = (chapterId, sectionId) => {
    setActiveChapter(chapterId)
    setActiveSection(sectionId)
    setMobileOpen(false)
  }

  const getContent = () => {
    const chapter = data.find((c) => c.chapter === activeChapter)
    if (!chapter) return null

    if (activeSection !== null) {
      const section = chapter.sections[activeSection]
      return (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{section.section}</h2>
          <p >{section.section_title}</p>
        </div>
      )
    }

    return chapter.sections.map((section, index) => (
      <div key={index} className="mb-4 bg-white p-4 rounded shadow w-[95vw] sm:w-[80vw]  break-all">
        <div className='flex justify-between items-center mb-2'>
          <h3 className="text-lg font-bold">SECTION : {section.section}</h3>
          <div className='flex justify-between text-sm text-gray-500 mb-2 gap-2'>
            <span className='hover:cursor-pointer' onClick={() => setEditable(true)}>edit</span>
            <span className='hover:cursor-pointer'>update</span>
          </div>
        </div>
        <p 
        key={index}
        contentEditable={editable}
        suppressContentEditableWarning={true}
         className=' flex text-justify font-sans  '>{section.section_title}</p>
      </div>
    ))
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (Fixed) */}
      <div className={`fixed md:static top-0 left-0 z-40 h-full w-45 bg-gray-100 p-4 border-r shadow transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

        {/* Mobile Close Button */}
        <div className="flex md:hidden justify-end mb-4">
          <button onClick={() => setMobileOpen(false)} className="text-sm text-red-500">
            Close ✕
          </button>
        </div>

        <h2 className="text-lg font-bold mb-4">Chapters</h2>
        <ul>
          {data.map((chapter, index) => (
            <li key={index} className="group relative mb-2">
              <button
                onClick={() => handleChapterClick(chapter.chapter)}
                className="w-full text-left font-medium p-2 rounded hover:bg-gray-200"
              >
                {lang === "hi" && 'अध्याय:'}{chapter.chapter}
              </button>

              {/* Section Dropdown */}
              <ul className="absolute left-full top-0 ml-2 bg-white border shadow-md hidden group-hover:block z-10 w-20">
                {chapter.sections.map((section, secIndex) => (
                  <li key={secIndex}>
                    <button
                      onClick={() => handleSectionClick(chapter.chapter, secIndex)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {section.section}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 ml-0 md:ml-0 p-4  bg-white">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button onClick={() => setMobileOpen(true)} className="text-gray-600 flex items-center">
            <Menu className="h-6 w-6 mr-2" /> Open Menu
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6 ">BNS 2023</h1>
        {getContent() || <p className="text-gray-500">Please select a chapter or section.</p>}
      </div>
    </div>
  )
}


