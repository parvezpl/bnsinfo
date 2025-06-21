'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import '../mainpage.css'
import LanguageSelector from './LanguageSelector'
import useStore from '../../../store/useStore'
import Image from 'next/image';

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
        <div className={`flex flex-row w-full items-center justify-between px-2 z-50 bg-blue-600 ${className}`}>
            <div className='w-full'>
                <div className="top-bar">
                    <div>
                        <span><b>Disclaimer:</b> This is a non-governmental site created for educational purposes, aiming to simplify Bharatiya Nyaya Sanhita 2023 for easy understanding.</span>
                    </div>
                    <div className=' flex justify-end px-2 text-black '>
                        <LanguageSelector setLanguages={(e) => setLanguages(e)} />
                    </div>
                </div>
                <div className="header">
                    <div className=''>
                        <h1>भारतीय न्याय संहिता 2023 </h1>
                        <h2>नया कानून गाइड</h2>
                    </div>
                    <div className="header-logos">
                        <Image src="/bnslogo.png" className='h-auto w-auto ' alt="Logo" width={100} height={40} />
                    </div>
                </div>
                <div className="navbar">
                    <a href="/">🏠 Home</a>
                    <a href="/about">About Us</a>
                    <a
                        onClick={() => {
                            router.push('/bns/mainpage/en')
                        }}
                        className='hover:cursor-pointer'
                    >Bharatiya Nyaya Sanhita 2023
                    </a>
                    <a onClick={() => {
                        router.push('/bns/mainpage/hi')
                    }}
                        className='hover:cursor-pointer'
                    >भारतीय न्याय संहिता,2023 (Hindi)
                    </a>
                    <a href="/blog">Blogs</a>
                    <a href="#">Forums</a>

                    {/* <div className="search-box">
                        <input id='i' type="text" placeholder="चोरी करने के सजा....." value={searchvalue} onChange={(e) => bnsSeachHandler(e.target.value)} />
                        <button id='i' type="submit" onClick={searchbutton} className=' transition duration-150 bg-blue-400' >🔍</button>
                    </div> */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Prevent page reload
                            searchbutton();     // Call your submit function
                        }}
                        className="search-box"
                    >
                        <input
                            id="i"
                            type="text"
                            placeholder="चोरी करने के सजा....."
                            value={searchvalue}
                            onChange={(e) => bnsSeachHandler(e.target.value)}
                            className="px-2 py-1"
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
