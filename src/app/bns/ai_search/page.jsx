"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import getEmbedding from "../ai/getEmbedding";
import LoadingCard from "../../../components/loading";
import getHindiEmbedding from "../ai/HindiEmbedding";
import useStore from "../../../../store/useStore";
import TypingText from "@/components/TypingText"; // Import the component

export default function BnsSearchPage() {
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [queryIsActive, setQueryIsActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const searchParam = useStore((state) => state.searchparam);
    const lang = useStore((state) => state.languages);
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (!searchParam?.trim()) return;
        setQuery(searchParam);
        setQueryIsActive(true);
        vectorHandler(searchParam);
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom when new result is added
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [searchResult]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setQueryIsActive(true);
        vectorHandler(query);
    };

    const vectorHandler = async (query) => {
        setLoading(true);
        setSearchResult([])
        const vector = lang === "hi" ? await getHindiEmbedding(query) : await getEmbedding(query);

        const res = await fetch('/api/ai/vector_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                vector: vector,
                lang: lang
            })
        });

        const data = await res.json();
        setSearchResult(data.searchResult); // Append new results like chat
        setLoading(false);
    };

    return (
        <div className=" relative min-h-full flex flex-col items-center justify-start bg-gray-100 p-4" >
            <form onSubmit={handleSearch} className=" fixed w-full max-w-xl flex items-center space-x-4 mb-8 z-999 ">
                <Input
                    type="text"
                    placeholder="Search Bns Act and Query"
                    className="flex-grow p-4 text-lg rounded-full border bg-gray-50 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" className="rounded-full px-6 py-2 text-lg">
                    AI Search
                </Button>
            </form>

            <div className="flex flex-col items-center w-[90vw] h-full  space-y-4 overflow-y-auto" >
                {queryIsActive && loading && <LoadingCard />}

                {searchResult.map((item, index) => (
                    <motion.div
                        key={ index}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-2xl shadow-md self-start "
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-blue-500">AI Response</span>
                            <span className="text-xs text-gray-400">Score: {item.score?.toFixed(2)}</span>
                        </div>
                        {/* Typing effect here */}
                        धारा : {item.payload.section}
                        <TypingText text={item.payload.section_content} />
                    </motion.div>
                ))}

                <div />
                {/* ref={messageEndRef} */}
            </div>
        </div>
    );
}
