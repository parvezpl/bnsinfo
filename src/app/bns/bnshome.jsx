'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { TiThMenu } from "react-icons/ti";
import LanguageSelector from '../utlty/LanguageSelector';
import { IoIosSearch } from "react-icons/io";

export default function BnsHome() {
    const [bns, setBns] = useState()
    const [sidebar, setSidebar] = useState(true)
    const [act, setAct] = useState()
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [chapters, setChapters] = useState({})
    const [language, setLanguage] = useState('hi')
    const sidebarRef = useRef(null);
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
    useEffect(() => {
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
            setBns(data.bnshi?.sections)
        }
        fetchData()
    }, [language])


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500); // wait 500ms

        return () => clearTimeout(handler); // clear timer on next input
    }, [searchTerm]);

    useEffect(() => {

        const fetchResults = async () => {
            const res = language === "en" ? await fetch(`/api/bns/bnssearch?search=${debouncedTerm}`) : await fetch(`/api/bns/bnshindi/bnssearch?search=${debouncedTerm}`)
            const datas = res.json();
            datas.then((data) => {
                setBns(data.bns)
            })
        };

        fetchResults();
    }, [debouncedTerm, language]);

    const searchhandler = (e) => {
        setSearchTerm(e.target.value)
    }


    const chapterhanler = async (item) => {
        const res = language === "en" ? await fetch('/api/bns/bnschapter?search=' + item.value) : await fetch('/api/bns/bnshindi/bnschapter?search=' + item.id)
        if (res.ok) {
            const data = await res.json()
            setChapters(data.chapter)
            setBns(data.chapter.sections)
        }
    }


    const pagehandler = (e) => {
        console.log(e.target.innerText)
        const chapter = e.target.innerText
        setBns(bns.detail[chapter - 1])
        // console.log(bns.detail[chapter - 1])
    }
    function smartSplit(text) {
        // const matches = [...text.matchAll(/(?=\((?:[a-z]|\d+)\))/g)];
        console.log(text)
        const matches = [...text.matchAll(/(?=\(\w+\))/g)];
        console.log(matches)

        const result = [];

        let lastIndex = 0;
        let lastSliceHadSubsection = false;

        for (const match of matches) {
            const start = match.index;
            const segment = text.slice(lastIndex, start);

            if (!segment.toLowerCase().includes("sub-section") && segment.trim()) {
                result.push(segment.trim());
                lastSliceHadSubsection = false;
            } else {
                // merge with previous if 'sub-section' detected
                if (result.length > 0) {
                    result[result.length - 1] += " " + segment.trim();
                } else {
                    result.push(segment.trim());
                }
                lastSliceHadSubsection = true;
            }

            lastIndex = start;
        }

        const finalPart = text.slice(lastIndex).trim();
        if (finalPart) {
            if (lastSliceHadSubsection && result.length > 0) {
                result[result.length - 1] += " " + finalPart;
            } else {
                result.push(finalPart);
            }
        }

        return result;
    }


    const getHighlightedText = (text, highlight) => {
        // const text=textbreack(texts)
        if (!highlight) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        const data = parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={i} className="bg-yellow-300 ">{part}</span>
            ) : (
                <span key={i} className=" font-sans  ">{part}</span>
            )
        );
        return <div className='whitespace-break-spaces '>{data}</div>
    };
    return (
        <div className=' relative flex-col w-full text-black bg-white '>
            <div className=' fixed w-screen z-50  flex flex-col p-2 bg-green-500  border-gray-200 drop-shadow-black'>
                <div className='flex flex-row items-center justify-between px-2'>
                    {/* <button></button> */}
                    <div className='bg-amber-500 text-black font-bold rounded-md px-4 py-1 select-none'>
                        BNS-INFO
                    </div>
                    <div className='flex flex-row items-center justify-center gap-2 border border-gray-500 rounded-lg'>
                        <input type="text" placeholder="Search..." className=' p-2' onChange={searchhandler} />
                        <IoIosSearch className='text-2xl' />
                    </div>
                </div>
            </div>
            <div className='flex relative flex-row justify-center pt-15 '>

                <main className=' min-h-full w-full flex flex-col items-center shadow-md box-border  '>
                    <div className=' relative w-full flex flex-col sm:grid grid-cols-[50px_1fr_200px] bg-green-400 px-2 '>
                        <div className=' absolute sm:sticky top-22 text-3xl text-blue-900 cursor-pointer  flex sm:place-content-center sm:items-center' onClick={() => setSidebar(prev => !prev)} >
                            <TiThMenu />
                        </div>
                        <h1 className=' col-start-2 text-2xl sm:text-3xl  font-bold text-center my-4 capitalize'>bharatiya nyaya sanhita 2023</h1>
                        <div className=' flex justify-end px-2'>
                            <LanguageSelector setLanguages={(e) => setLanguage(e)} />
                        </div>
                    </div>
                    <div className='flex w-full px-2 '>
                        <div ref={sidebarRef} className={` absolute sm:relative left-0 flex-col items-center w-fit  overflow-auto bg-green-300 border-b-1 rounded-b-md px-2 shadow-md ${sidebar ? 'visible' : 'hidden sm:visible'}`}>
                            <div className='flex flex-col items-center  justify-center  rounded-lg shadow-md  '>
                                {
                                    chapter.map((item, index) => {
                                        return (
                                            <button key={index} onClick={() => chapterhanler(item)}
                                                className='flex flex-row select-none text-xl cursor-pointer w-max text-black hover:text-gray-100
                                         hover:bg-green-500 justify-center items-center gap-2  p-1 rounded-md  font-bold my-0.5 border-b-1 
                                         touch-manipulation transition-colors duration-150 active:bg-blue-600 !important">
                                         '>
                                                {item.name}
                                            </button >
                                        )
                                    }
                                    )
                                }
                            </div>
                        </div>
                        <div className=' flex flex-col w-full min-h-full sm:w-full items-center border-l-1  p-4 box-border'>
                            <div className={`flex flex-col items-center w-full mb-4 ${searchTerm.length > 0 ? 'hidden' : 'visible'}`}>
                                <h1 className=' text-2xl font-bold'>{chapters.chapter}</h1>
                                <h3 className=' text-xl font-bold text-gray-700'>{chapters.chapter_title}</h3>
                            </div>
                            <div className='w-full flex flex-col items-center'>
                                {
                                    bns && bns.map((item, index) => {
                                        return (
                                            <div key={index} className='flex flex-col sm:flex-row min-h-fit  justify-center w-fit gap-2 px-2 py-4 '>
                                                <div className='flex flex-row  sm:flex-col text-[16px]  justify-center sm:justify-start sm:items-start text-gray-950 font-bold  px-1'>
                                                    <div className='flex bg-gray-800 text-white px-4 py-2 rounded-sm '>
                                                        <span>BNS__  </span> <span className='w-[81px] flex'>ACT :- {getHighlightedText(item.section, searchTerm)}</span>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-2 grow text-justify'>
                                                    <pre className='text-blue-950 font-bold h-fit sm:w-[50vw] font-sans whitespace-break-spaces'>
                                                        {getHighlightedText(item.section_title, searchTerm)}
                                                    </pre>

                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    {/* <div className='justify-center w-full flex   bg-gray-300 rounded-md p-2 text-2xl text-black'>
                        <AiFillCaretLeft />
                        <div className=' flex w-100 bg-gray-200 mx-2 gap-2 overflow-auto'>
                            {
                                numbers.map((num, index) => {
                                    return (
                                        <div key={index} onClick={pagehandler} className='flex cursor-pointer hover:text-gray-100 hover:bg-green-500 justify-center items-center gap-2 text-sm bg-gray-300 p-1 rounded-md  font-bold'>
                                            {num}
                                        </div>
                                    )
                                })}
                        </div>
                        <AiFillCaretRight className=' cursor-pointer hover:text-blue-700' />
                    </div> */}
                </main>
            </div>
        </div>
    )
}
