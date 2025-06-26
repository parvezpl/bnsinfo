'use client'
import React, { useState } from 'react'
import { motion } from "framer-motion";
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

        <div className='flex justify-center py-2'>
            <div className='flex flex-col items-center bg-green-50 pb-20 w-full rounded-sm shadow-md '>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl font-bold text-gray-800 mb-8 mt-8"
                >
                    BNS INFO
                </motion.h1>

                <form onSubmit={handleSearch} className="w-full max-w-xl flex items-center space-x-4">
                    <Input
                        type="text"
                        placeholder="Search Bns Act and Qeury"
                        className="flex-grow p-4 text-lg rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button onClick={() => ""} type="submit" className="rounded-full px-6 py-2 text-lg"
                    >
                        AI Search
                    </Button>
                </form>
            </div>
        </div>
    )
}
