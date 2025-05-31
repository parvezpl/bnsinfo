'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Navigation({className}) {
    const router = useRouter()
    return (
        <div className={`flex flex-row w-full items-center justify-between px-2 z-50 bg-blue-600 ${className}`}>
            <div onClick={()=>router.push('/')} className='bg-amber-500 cursor-pointer flex shrink-0 m-1 justify-center items-center text-[10px] sm:text-[12px] text-black font-bold rounded-md px-2 py-1 h-[20px] w-[80px] select-none'>
                BNS-INFO
            </div>
        </div>
    )
}
