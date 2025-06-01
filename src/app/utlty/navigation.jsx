'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import '../mainpage.css'
import LanguageSelector from './LanguageSelector'
import useStore from '../../../store/useStore'

export default function Navigation({ className }) {
    const router = useRouter()
    const [searchvalue, setSearchvalue] = useState('')
    const [language, setLanguage] = useState('')
    const setSearchparam = useStore((state)=>state.setSearchparam)

    useEffect(() => {
        localStorage.setItem('lang',  'hi');
        setSearchvalue('')
    }, [])

    const bnsSeachHandler = (e) => {
        setSearchvalue(e)
    }
    const searchbtn = async () => {
        router.push(`/bns/bnssearch`)
        setSearchparam(searchvalue)
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
                        <LanguageSelector setLanguages={(e) => setLanguage(e)} />
                    </div>
                </div>
                <div className="header">
                    <div className=''>
                        <h1>भारतीय न्याय संहिता 2023 </h1>
                        <h2>नया कानून गाइड</h2>
                    </div>
                    <div className="header-logos">
                        {/* <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Digital_India_logo.png" alt="Digital India" /> */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/India_Emblem.png/120px-India_Emblem.png" alt="India Code" />
                    </div>
                </div>
                <div className="navbar">
                    <a href="/">🏠 Home</a>
                    <a href="about.html">About Us</a>
                    <a href="/bns/en">Bharatiya Nyaya Sanhita 2023</a>
                    <a href="/bns/hi">भारतीय न्याय संहिता,2023 (Hindi)</a>
                    <a href="#">Blogs</a>
                    <a href="#">Forums</a>


                    <div className="search-box">
                        <input type="text" placeholder="चोरी करने के सजा....." value={searchvalue} onChange={(e) => bnsSeachHandler(e.target.value)} />
                        <button onClick={() => searchbtn() } className=' transition duration-150 bg-blue-400' >🔍</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
