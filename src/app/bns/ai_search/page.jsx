"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import getEmbedding from "../ai/getEmbedding";
import LoadingCard from "../mainpage/[lang]/loading";
import getHindiEmbedding from "../ai/HindiEmbedding";
import useStore from "../../../../store/useStore";

export default function BnsSearchPage() {
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState([])
    const [queryisactiov, setQueryisactiove] = useState(false)
    const [loading, setLoading] = useState(true)
    const searchparam = useStore((state)=>state.searchparam)
    const lang = useStore((state)=>state.languages)

    useEffect(()=>{
        if (!searchparam?.trim()) return;
        setQuery(searchparam)
        setQueryisactiove(true)
        vacterhandler(searchparam)
    },[])

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setQueryisactiove(true)
    };

    const vacterhandler = async (query) => {
        setLoading(true)
        // const vector = await get(query)
        const vector = lang === "hi" ? await getHindiEmbedding(query) : await getEmbedding(query)
        // console.log("vector", vector)
        const res = await fetch('/api/ai/vector_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                vector: vector,
                lang:lang
            })
        })
        const data = await res.json()
        setSearchResult(data.searchResult)
        setLoading(false)
    }

    return (
        <div className="min-h-full flex flex-col items-center justify-center bg-gray-100 p-4 ">
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
                <Button onClick={() => vacterhandler(query)} type="submit" className="rounded-full px-6 py-2 text-lg"
                >
                    Search
                </Button>
            </form>
            <div className="flex flex-col justify-center items-center w-full">
                
                {
                   queryisactiov &&  loading ? <LoadingCard/>
                    : 
                    searchResult.map(item=>{
                        return(
                            <ul key={item.id} className="w-[90vw] my-4 border p-2 shadow rounded-sm ">
                                <li className="flex font-bold justify-between ">Act : {item.payload.section} <span className=" text-gray-400">{item.score}</span></li>
                                <li className=" text-justify">{item.payload.section_content}</li>
                            </ul>
                        )
                    })
                }
            </div>
        </div>
    );
}
