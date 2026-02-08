'use client'
import React, { useEffect, useState } from 'react'
import { notificationResponse } from './notificationFetch'
import './notification.css'

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
        <section className="tips">
            <div className="tips-header">
                <div className="tips-badge">आज का टिप</div>
                <h2 className="tips-title">Tips of the day</h2>
                <p className="tips-subtitle">रोज़ाना एक नई धारा, सरल भाषा में</p>
            </div>

            <div className="tips-card">
                {loading ? (
                    <div className="tips-skeleton">
                        <div className="skeleton-line w-60"></div>
                        <div className="skeleton-line w-40"></div>
                        <div className="skeleton-line w-50"></div>
                    </div>
                ) : (
                    <div className="tips-content">
                        <p className="tips-section">धारा : {notification?.section}</p>
                        <p className="tips-text">{notification?.section_content}</p>
                    </div>
                )}
            </div>
        </section>
    )
}
