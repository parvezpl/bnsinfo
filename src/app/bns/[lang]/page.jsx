'use client'
import React, { use, useEffect, useRef, useState } from 'react'
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { TiThMenu } from "react-icons/ti";
import LanguageSelector from '../../utlty/LanguageSelector';
import { IoIosSearch } from "react-icons/io";
import useStore from '../../../../store/useStore';



export default function BnsHome({params}) {
    // const [bns, setBns] = useState([])
    const [sidebar, setSidebar] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [language, setLanguage] = useState('hi')
    const sidebarRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef([]);
    const lang = useStore((state) => state.languages);
    const bns = useStore((state) => state.bnshindi);
    const bnsenglish = useStore((state) => state.bnsenglish);
    
  

    useEffect(() => {
        setLanguage(lang)
        const md = window.innerWidth <= 768;
        if (md && sidebar) {
            setSidebar(false)
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            const isMobile = window.innerWidth <= 768;
            if (isMobile && sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebar) {
                setSidebar(false)
            }
        }
        if (sidebar) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [sidebar])


    const chapter = [
        { id: 1, name: "chapter 1", value: 'CHAPTER I' },
        { id: 2, name: "chapter 2", value: 'CHAPTER II' },
        { id: 3, name: "chapter 3", value: 'CHAPTER III' },
        { id: 4, name: "chapter 4", value: 'CHAPTER IV' },
        { id: 5, name: "chapter 5", value: 'CHAPTER V' },
        { id: 6, name: "chapter 6", value: 'CHAPTER VI' },
        { id: 7, name: "chapter 7", value: 'CHAPTER VII' },
        { id: 8, name: "chapter 8", value: 'CHAPTER VII' },
        { id: 9, name: "chapter 9", value: 'CHAPTER IX' },
        { id: 10, name: "chapter 10", value: 'CHAPTER X' },
        { id: 11, name: "chapter 11", value: 'CHAPTER XI' },
        { id: 12, name: "chapter 12", value: 'CHAPTER XII' },
        { id: 13, name: "chapter 13", value: 'CHAPTER XIII' },
        { id: 14, name: "chapter 14", value: 'CHAPTER XIV' },
        { id: 15, name: "chapter 15", value: 'CHAPTER XV' },
        { id: 16, name: "chapter 16", value: 'CHAPTER XVI' },
        { id: 17, name: "chapter 17", value: 'CHAPTER XVII' },
        { id: 18, name: "chapter 18", value: 'CHAPTER XVIII' },
        { id: 19, name: "chapter 19", value: 'CHAPTER XIX' },
        { id: 20, name: "chapter 20", value: 'CHAPTER XX' },





    ]

    useEffect(() => {
        const fetchData = async () => {
            const res = language === "en" ? await fetch('/api/bns/bnsen') : await fetch('/api/bns/bnshindi/bnshi')
            const data = await res.json()
            // console.log(data)
            setBns(data.bns)
        }
     
    }, [language])


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500); // wait 500ms

        return () => clearTimeout(handler); // clear timer on next input
    }, [searchTerm]);

    useEffect(() => {
        const fetchResults = async () => {
            console.log("debouncedTerm",language, debouncedTerm)
            const res = language === "en" ? await fetch(`/api/bns/bnssearch?search=${debouncedTerm}`) : await fetch(`/api/bns/bnshindi/bnssearch?search=${debouncedTerm}`)
            const datas = res.json();
            datas.then((data) => {
                // setBns(data.bns)
            })
        };

        fetchResults();
    }, [debouncedTerm, language]);

    const searchhandler = (e) => {
        setSearchTerm(e.target.value)
    }


    const chapterhanler = async (item, index) => {
        sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }


    // const pagehandler = (e) => {
    //     console.log(e.target.innerText)
    //     const chapter = e.target.innerText
    //     // setBns(bns.detail[chapter - 1])
    //     // console.log(bns.detail[chapter - 1])
    // }
    // function smartSplit(text) {
    //     // const matches = [...text.matchAll(/(?=\((?:[a-z]|\d+)\))/g)];
    //     console.log(text)
    //     const matches = [...text.matchAll(/(?=\(\w+\))/g)];
    //     console.log(matches)

    //     const result = [];

    //     let lastIndex = 0;
    //     let lastSliceHadSubsection = false;

    //     for (const match of matches) {
    //         const start = match.index;
    //         const segment = text.slice(lastIndex, start);

    //         if (!segment.toLowerCase().includes("sub-section") && segment.trim()) {
    //             result.push(segment.trim());
    //             lastSliceHadSubsection = false;
    //         } else {
    //             // merge with previous if 'sub-section' detected
    //             if (result.length > 0) {
    //                 result[result.length - 1] += " " + segment.trim();
    //             } else {
    //                 result.push(segment.trim());
    //             }
    //             lastSliceHadSubsection = true;
    //         }

    //         lastIndex = start;
    //     }

    //     const finalPart = text.slice(lastIndex).trim();
    //     if (finalPart) {
    //         if (lastSliceHadSubsection && result.length > 0) {
    //             result[result.length - 1] += " " + finalPart;
    //         } else {
    //             result.push(finalPart);
    //         }
    //     }

    //     return result;
    // }


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
        if (bns.length === 0) return;
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
    }, [bns]);


    return (
        <div className=' relative flex-col w-full  text-black bg-white h-screen overflow-hidden '>
            <div className=' fixed z-100 flex gap-1 bg-gray-300 cursor-pointer text-black rounded-sm select-none px-2 py-1  '  >
                <span className='hover:bg-blue-400 px-1 transition-colors duration-150 active:bg-blue-600' onClick={() => setSidebar(prev => !prev)}>chapter</span>
                <span className='hover:bg-blue-400 px-1 transition-colors duration-150 active:bg-blue-600'>Section</span>
            </div>
            <div className=' fixed  w-screen z-50  flex flex-col  py-1 border-gray-200 drop-shadow-black'>
                <div className='w-fit flex right-0 absolute'>
                    {/* <div className='flex w-40 sm:w-[300px] items-center justify-center gap-2 border border-gray-500 rounded-lg mr-4'>
                        <input type="text" placeholder="Search..." className=' w-full h-5 p-2 bg-white focus:outline-none ' onChange={searchhandler} />
                        <IoIosSearch className='text-2xl' />
                    </div> */}
                    <div className=' flex justify-end px-2 '>
                        <LanguageSelector setLanguages={(e) => setLanguage(e)} />
                    </div>
                </div>
                <div ref={sidebarRef} className={`sm:fixed mt-10 sm:mt-[181.5px] h-[calc(100vh-181.5px)]  pointer-events-auto absolute top-0 w-40  overflow-y-auto bg-gray-200 rounded-b-md px-2 shadow-md ${sidebar ? 'visible' : 'hidden sm:visible'}`}>
                    <div className='flex flex-col items-center justify-center rounded-lg'>
                        {
                            chapter.map((item, index) => {
                                return (
                                    <button key={index} onClick={() => chapterhanler(item, index)}
                                        className={`select-none text-sm cursor-pointer w-max text-black hover:text-blue-700
                                                hover:bg-gray-100 justify-center items-center gap-2  p-1 rounded-md font-semibold my-1 border-b-1 
                                                touch-manipulation transition-colors duration-150 active:bg-blue-600 !important 
                                                ${activeIndex === index ? ' bg-blue-300' : 'hover:bg-gray-200'}
                                                `}>
                                        {item.name}
                                    </button >
                                )
                            }
                            )
                        }
                    </div>
                </div>
            </div>
            <div className='w-screen box-border'>
                <main className='min-h-full w-full relative '>
                    <div className='  h-screen overflow-auto  '>
                        {
                            bns.length > 0 ? bns?.map((bnsItem, index) => {
                                return (
                                    <div key={index}
                                        ref={(el) => (sectionRefs.current[index] = el)}
                                        className=' scroll-mt-20 mt-20 flex flex-col w-full min-h-full sm:w-full items-center p-4 box-border '>
                                        <div className={`flex flex-col items-center w-full mb-4 ${searchTerm.length > 0 ? 'hidden' : 'visible'}`}>
                                            <h1 className=' text-2xl font-bold'>{bnsItem.chapter}</h1>
                                            <h3 className=' text-[16px] font-bold text-gray-700'>{bnsItem.chapter_title}</h3>
                                        </div>
                                        <div className='w-full h-[100vh] flex flex-col items-center overflow-auto'>
                                            {
                                                bnsItem?.sections.map((item, indexs) => {
                                                    return (
                                                        < div key={indexs}>
                                                            <div
                                                                className='flex flex-col sm:flex-row min-h-fit  justify-center w-fit gap-2 px-2 py-4 '
                                                            >
                                                                <div className='flex flex-row  sm:flex-col text-[14px]  justify-center sm:justify-start sm:items-start text-gray-950 font-bold  px-1'>
                                                                    <div className='flex bg-gray-300 text-blue-900 px-4 py-2 rounded-sm '>
                                                                        <span>BNS__  </span> <span className='w-[81px] flex'>ACT :- {getHighlightedText(item.section, searchTerm)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className='flex flex-col gap-2 grow text-justify '>
                                                                    <pre className='text-blue-950 font-bold text-[14px] h-fit sm:w-[50vw] font-sans whitespace-break-spaces'>
                                                                        {getHighlightedText(item.section_title, searchTerm)}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>


                                    </div>)
                            }) :
                                <div className="flex items-center justify-center space-x-2 h-full">
                                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full  animate-bounce"></div>
                                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse delay-150"></div>
                                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce delay-300"></div>
                                </div>
                        }
                    </div>
                </main>
            </div>
        </div>
    )
}
