'use client'
import React, { useEffect, useRef, useState } from 'react'
import useStore from '../../../../store/useStore'

export default function Page() {
    const [searchdata, setSearchdata] = useState([])
    const [sectionlist, setSectionlist] = useState([])
    const searchparam = useStore((state) => state.searchparam);
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef([]);

    const sectionrhanler = async (item, index) => {
        sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    useEffect(() => {
        setSectionlist([])
        setSearchdata([])
        const fetchdata = async () => {
            const savedLang = await localStorage.getItem('lang');
            if (savedLang) {
                const res = await fetch(`/api/bns/search?search=${encodeURIComponent(searchparam)}}&lang=${savedLang}`)
                const data = await res.json();
                console.log(data, searchparam)
                setSearchdata(data)
                if (data) {
                    const sections = []
                    data.bns?.map((item) => {
                        // console.log(item)
                        if (item) {
                            sections.push(...item.sections)
                            setSectionlist(sections)
                        }
                    })
                }
            }
        }
        fetchdata()
    }, [searchparam])

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

    useEffect(() => {
        if (sectionlist.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // console.log(entry.target)
                    if (entry.isIntersecting) {
                        const index = sectionRefs.current.findIndex((ref) => ref === entry.target);
                        setActiveIndex(index);
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,// when 50% visible
            }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [sectionlist]);

    return (
        <div className=' flex flex-col items-center justify-center w-full bg-gray-50 text-black  '>
            {
                !searchparam ?
                    <div className='w-full h-[181.5px] z-10 flex items-center justify-center text-black text-xl font-bold'>
                        Please enter a search term
                    </div>
                    :
                    <div className='w-full flex flex-col items-center justify-center'>
                        <h1 className='text-2xl font-bold text-black py-4'>Search Results for: <span className='text-blue-500'>{searchparam}</span></h1>
                        <div>
                            <div className='sm:pl-32 w-[cals(100vw-62)] min-h-full  text-black'>
                                {
                                    searchdata ?
                                        searchdata.error ? <h1 className='flex justify-center items-center h-64 text-center'>{searchdata.error}</h1> :
                                            searchdata.bns?.map((item, index) => {
                                                return (
                                                    <div key={index}
                                                        className='flex flex-row bg-white w-full items-center text-[13px] sm:text-[16px] justify-center gap-4' >
                                                        <ul className='fixed left-0 top-[210px] sm:top-[150px] bg-gray-300 text-black w-8 sm:w-32 text-[12px] sm:text-[100%] text-center h-[calc(100vh-150px)] overflow-auto cursor-pointer'>
                                                            {
                                                                sectionlist?.map((section, index) => {
                                                                    return (
                                                                        <li key={index}

                                                                            onClick={() => sectionrhanler(section, index)} className=' flex my-1 justify-center text-center  hover:bg-blue-400 transition duration-150 active:bg-blue-500 '><span className='hidden sm:block'>ACT-</span> {section.section}</li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                        <div className='flex flex-col items-center'>
                                                            <div className='bg-green-400 text-center w-fit px-4 py-1 my-4' >{item.chapter}</div>
                                                            <ul className='mx-10 flex flex-col justify-center '>
                                                                {
                                                                    item.sections?.map((val, ind) => {
                                                                        return (
                                                                            <li key={ind}
                                                                                ref={(el) => (sectionRefs.current[ind] = el)}
                                                                                className='flex flex-col items-center scroll-mt-54 sm:scroll-mt-40'>
                                                                                <span className='bg-gray-700 text-white px-4 w-fit '> SECTION: - {val.section}</span>
                                                                                <pre >{getHighlightedText(val.section_title, searchparam)}</pre>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>

                                                        </div>
                                                    </div>
                                                )
                                            })
                                        :

                                        <div className="flex items-center justify-center space-x-2 h-[200px]">
                                            <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full  animate-bounce"></div>
                                            <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse delay-150"></div>
                                            <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce delay-300"></div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
            }
        </div >
    )
}
