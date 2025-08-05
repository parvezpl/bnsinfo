'use client'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import useStore from '../../../../store/useStore';

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

        <div className='flex justify-center py-1'>
            <div className='flex flex-col items-center py-6 w-full '>
                <form onSubmit={handleSearch} className="flex-col w-full max-w-xl flex gap-4 items-center ">
                    <Input
                        type="text"
                        placeholder="Search Bns Act and Qeury"
                        className="flex-grow p-4 text-lg rounded-full border bg-gray-100 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button type="submit" className="rounded-full px-6 py-2 text-lg"
                    >
                        AI Search
                    </Button>
                </form>
            </div>
        </div>
    )
}
