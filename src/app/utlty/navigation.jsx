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
                        <span className='text-[6px] sm:text-[10px] inline-block '><b>Disclaimer:</b> This is a non-governmental site created for educational purposes, aiming to simplify Bharatiya Nyaya Sanhita 2023 for easy understanding.</span>
                    </div>
                    <div className=' flex justify-end px-2 text-black '>
                        <LanguageSelector setLanguages={(e) => setLanguages(e)} />
                    </div>
                </div>
                <div className="header">
                    <div className='flex flex-col items-center '>
                        <h1 className='text-[12px] sm:!text-[16px]' style={{ fontSize: "12px", fontWeight: 'bold' }} >भारतीय न्याय संहिता 2023 </h1>
                        <h2 className='sm:!text-[14px]' style={{ fontSize: '10px' }}>नया कानून गाइड</h2>
                    </div>
                    <div className='flex gap-2'>
                        <div className="header-logos">
                            <Image src="/bnslogo.png" className='sm:h-auto sm:w-auto !h-9 w-18  ' alt="Logo" width={100} height={40} />
                        </div>
                        <div className="flex justify-center items-center">
                            <div className='flex justify-center items-center bg-green-500 w-10 h-10 rounded-3xl overflow-hidden shadow-sm border '>
                                Profile
                            </div>
                        </div>
                    </div>
                </div>
                <div className="navbar ">
                    <Link href="/" className='!text-[10px] sm:!text-[14px]  '>🏠 Home</Link>
                    <Link href="/about" className='!text-[10px] sm:!text-[14px]  '>About Us</Link>
                    <Link href="/bns/mainpage/en" className='!text-[10px] sm:!text-[14px] !hidden sm:!block '>Bharatiya Nyaya Sanhita 2023</Link>
                    <Link href="/bns/mainpage/en" className='!text-[10px] sm:!text-[14px] !block sm:!hidden '>bns 2023</Link>
                    <Link href="/bns/mainpage/hi" className='!text-[10px] sm:!text-[14px] !hidden sm:!block  '>भारतीय न्याय संहिता,2023 (Hindi)</Link>
                    <Link href="/bns/mainpage/hi" className='!text-[10px] sm:!text-[14px] !block sm:!hidden '>भा0न्या0सं0 2023</Link>
                    <Link href="/blog" className='!text-[10px] sm:!text-[14px] '>Blogs</Link>
                    <Link href="#" className='!text-[10px] sm:!text-[14px] '>Forums</Link>

                    {/* <div className="search-box">
                        <input id='i' type="text" placeholder="चोरी करने के सजा....." value={searchvalue} onChange={(e) => bnsSeachHandler(e.target.value)} />
                        <button id='i' type="submit" onClick={searchbutton} className=' transition duration-150 bg-blue-400' >🔍</button>
                    </div> */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Prevent page reload
                            searchbutton();     // Call your submit function
                        }}
                        className="search-box "
                    >
                        <input
                            id="i"
                            type="text"
                            placeholder="चोरी करने के सजा....."
                            value={searchvalue}
                            onChange={(e) => bnsSeachHandler(e.target.value)}
                            className="px-2 py-1 text-sm text-white outline"
                        />
                        <button
                            type="submit"
                            className="transition duration-150 bg-blue-400 px-3 py-1"
                        >
                            🔍
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
