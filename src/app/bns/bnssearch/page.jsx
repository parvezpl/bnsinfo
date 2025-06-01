'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const [searchdata, setSearchdata] = useState([])
    const [sectionlist, setSectionlist] = useState([])
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    // console.log(search)
    useEffect(() => {
        setSectionlist([])
        setSearchdata([])
        const fetchdata = async () => {
            const savedLang = await localStorage.getItem('lang');
            if (savedLang) {
                const res = await fetch(`/api/bns/search?search=${encodeURIComponent(search)}}&lang=${savedLang}`)
                const data = await res.json();
                setSearchdata(data)
                if (data) {
                    const sections = []
                    data.map((item) => {
                        // console.log(item)
                        if (item) {
                            sections.push(...item.sections)
                            setSectionlist(sections)
                        }
                    })
                }
            }
            // console.log(data)
        }
        fetchdata()
    }, [search])

    const getHighlightedText = (text, highlight) => {
        // const text=textbreack(texts)
        if (!highlight) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        const data = parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={i} className="bg-yellow-300 text-black ">{part}</span>
            ) : (
                <span key={i} className=" font-sans  ">{part}</span>
            )
        );
        return <div className='whitespace-break-spaces '>{data}</div>
    };

    return (
        <div className=' flex justify-center w-full h-screen '>
            <ul className='fixed left-0 bg-gray-300 text-black w-8 sm:w-32 text-[12px] sm:text-[100%] text-center h-[calc(100vh-181.5px)] overflow-auto cursor-pointer'>
                {
                    sectionlist?.map((section, index) => {
                        return (
                            <li key={index} className=' flex my-1 justify-center text-center hover:bg-blue-400 transition duration-150 active:bg-blue-500 '><span className='hidden sm:block'>ACT-</span> {section.section}</li>
                        )
                    })
                }
            </ul>
            <div className='sm:pl-32 w-[cals(100vw-62)]'>
                {
                    searchdata && searchdata?.map((item, index) => {
                        return (
                            <div key={index} className='flex flex-row items-center justify-center gap-4' >
                                <div className='flex flex-col items-center'>
                                    <div className='bg-green-400 text-center w-fit px-4 py-1 my-4' >{item.chapter}</div>
                                    <ul className='mx-10 flex flex-col justify-center'>
                                        {
                                            item.sections?.map((val, ind) => {
                                                return (
                                                    <li key={ind} className='flex flex-col items-center'>
                                                        <span className='bg-gray-700 text-white px-4 w-fit'> SECTION: - {val.section}</span>
                                                        <pre >{getHighlightedText(val.section_title, search)}</pre>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>

                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
