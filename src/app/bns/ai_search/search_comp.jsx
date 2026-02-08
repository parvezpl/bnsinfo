'use client'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import useStore from '../../../../store/useStore';
import './search_comp.css'

export default function Search_comp() {
    const [query, setQuery] = useState("");
    const rounter = useRouter()
    const setSearchbtn = useStore((state => state.setSearchbtn))
    const [searchResult, setSearchResult] = useState([])
    const [queryisactiov, setQueryisactiove] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setQueryisactiove(true)
        setSearchbtn(query)
        rounter.push('/bns/ai_search')
    };

    return (
        <section className="search-wrap">
            <div className="search-shell">
                <div className="search-head">
                    <div className="search-badge">AI खोज</div>
                    <h3>BNS खोजें — सेक्शन, धारा या प्रश्न</h3>
                    <p>सटीक जानकारी के लिए अपना प्रश्न लिखें।</p>
                </div>
                <form onSubmit={handleSearch} className="search-form">
                    <Input
                        type="text"
                        placeholder="Search BNS Act or Query"
                        className="search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button type="submit" className="search-btn">
                        AI Search
                    </Button>
                </form>
            </div>
        </section>
    )
}
