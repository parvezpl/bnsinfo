'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import '../mainpage.css'
import LanguageSelector from './LanguageSelector'
import useStore from '../../../store/useStore'
import Image from 'next/image';
import Link from 'next/link'

export default function Navigation({ className }) {
    const router = useRouter()
    const [searchvalue, setSearchvalue] = useState('')
    const [language, setLanguage] = useState('')
    const setSearchbtn = useStore((state => state.setSearchbtn))
    const setLanguages = useStore((state => state.setLanguages))

    const bnsSeachHandler = (e) => {
        setSearchvalue(e)
    }
    const searchbutton = () => {
        setSearchbtn(searchvalue)
        // setSearchparam(searchvalue)
        router.push(`/bns/bnssearch`)

    }
    // console.log(language)
    return (
        <div className={`flex flex-row  items-center justify-between z-50  ${className}`}>
            <div className='w-full'>
                <div className="top-bar">
                    <div>
                        <span className='text-[1.1vw]'><b>Disclaimer:</b> This is a non-governmental site created for educational purposes, aiming to simplify Bharatiya Nyaya Sanhita 2023 for easy understanding.</span>
                    </div>
                    <div className=' flex justify-end px-2 text-black '>
                        <LanguageSelector setLanguages={(e) => setLanguages(e)} />
                    </div>
                </div>
                <div className="header">
                    <div className='flex flex-col items-center text-[32px]'>
                        <h1 >भारतीय न्याय संहिता 2023 </h1>
                        <h2>नया कानून गाइड</h2>
                    </div>
                    <div className="header-logos">
                        <Image src="/bnslogo.png" className='h-auto w-auto ' alt="Logo" width={100} height={40} />
                    </div>
                </div>
                <div className="navbar ">
                    <Link href="/" className='!text-[1.8vw] sm:!text-[16px]  '>🏠 Home</Link>
                    <Link href="/about" className='!text-[1.8vw] sm:!text-[16px]  '>About Us</Link>
                    <Link href="/bns/mainpage/en" className='!text-[1.8vw] sm:!text-[16px] '>Bharatiya Nyaya Sanhita 2023</Link>
                    <Link href="/bns/mainpage/hi" className='!text-[1.8vw] sm:!text-[16px]  '>भारतीय न्याय संहिता,2023 (Hindi)</Link>
                    <Link href="/blog" className='!text-[1.8vw] sm:!text-[16px] '>Blogs</Link>
                    <Link href="#" className='!text-[1.8vw] sm:!text-[16px] '>Forums</Link>

                    {/* <div className="search-box">
                        <input id='i' type="text" placeholder="चोरी करने के सजा....." value={searchvalue} onChange={(e) => bnsSeachHandler(e.target.value)} />
                        <button id='i' type="submit" onClick={searchbutton} className=' transition duration-150 bg-blue-400' >🔍</button>
                    </div> */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            searchbutton();
                        }}
                        className="border flex  justify-center items-center   rounded bg-gray-800 mx-auto sm:!h-[2vw] sm:!w-[20vw]"
                        style={{ width: '40vw', maxWidth: '600px', height:'4vw' }} // 90% of screen, up to 600px max
                    >
                        <input
                            id="i"
                            type="text"
                            placeholder="चोरी करने के सजा....."
                            value={searchvalue}
                            onChange={(e) => bnsSeachHandler(e.target.value)}
                            className="flex-grow min-w-0 px-2 py-2 text-sm text-white bg-transparent focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="flex justify-center items-center transition duration-150 bg-blue-500 hover:bg-blue-600 text-white px-3 m-1 rounded-r h-[3vw] text-[2vw]"
                        >
                            🔍
                        </button>
                    </form>


                </div>
            </div>
        </div>
    )
}
