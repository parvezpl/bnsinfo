'use client'
import React, { useEffect, useState } from 'react'
import { notificationResponse } from './notificationFetch'

export default function Notification() {
    const [notification, setNotification] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchdata = async () => {
            setLoading(true)
            const res = notificationResponse()
            const data = await res
            setNotification(data)
            setLoading(false)
        }
        fetchdata()
    }, [])
    return (
        <div className=' flex flex-col items-center h-40 text-center py-4'>
            <h1>Notification on the day</h1>
            <div className=' block flex-col justify-center items-center w-full sm:w-[80vw] h-40 bg-green-100 rounded-sm shadow-sm border p-2 overflow-y-auto'>
                {
                    loading ?  
                    <div className='flex flex-col gap-2 animate-pulse'>
                    <p className='w-[60vw] h-4 bg-gray-300'></p>
                    <p className='w-[40vw] h-4 bg-gray-300'></p>
                    <p className='w-[50vw] h-4 bg-gray-300'></p>
                    </div>
                    :
                        <div className=''>
                            <p className=' font-bold text-md'>धारा : {notification?.section}</p>
                            <p className='text-[12px] sm:text-[16px]'>{notification?.section_content}</p>
                        </div>
                }
            </div>
        </div>
    )
}
