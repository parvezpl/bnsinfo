'use client'
import React, { useEffect, useRef, useState } from 'react'
import useStore from '../../../../store/useStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';


export default function Page() {
    const [sectionlist, setSectionlist] = useState([])
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter()
    const sectionRefs = useRef([]);
    const searchparam = useStore((state)=>state.searchparam)
    const searchdata = useStore((state)=>state.searchdata)
    
    const sectionrhanler = async (item, index) => {
        sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    useEffect(() => {
        setSectionlist([])
    }, [searchparam])

    const getHighlightedText = (text, highlight) => {
        if (!highlight) return text;
        const parts = text?.split(new RegExp(`(${highlight})`, 'gi'));
        const data = parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={i} className="bg-yellow-300 text-black ">{part}</span>
            ) : (
                <span key={i} className=" font-sans  ">{part}</span>
            )
        );
        return <p className='whitespace-break-spaces '>{data}</p>
    };

    const aisearchhandler=()=>{
        router.push('/bns/ai_search')
    }
  
    return (
        <div className=' relative flex flex-col items-center justify-center w-full bg-gray-50 text-black  '>
            <Button 
            onClick={()=>aisearchhandler()}
              className={'sm:absolute z-50  top-0 right-0 mt-4 mr-4 bg-blue-900'}>AI Seach</Button>

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
                                            < ul className='mx-10 flex flex-col justify-center '>
                                                {
                                                    searchdata?.map((bns, index) => {
                                                        return (
                                                            <li key={index}
                                                                ref={(el) => (sectionRefs.current[index] = el)}
                                                                className='flex flex-col items-center scroll-mt-54 sm:scroll-mt-40'>
                                                                <span className='bg-gray-700 text-white px-4 w-fit '> SECTION: - {bns?.section}</span>
                                                                <span >{getHighlightedText(bns?.section_title || bns?.section_content, searchparam)}</span>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>

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
