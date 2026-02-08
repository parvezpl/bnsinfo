"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import LoadingCard from "../../../components/loading";
import useStore from "../../../../store/useStore";
import TypingText from "@/components/TypingText"; // Import the component
import styles from "./page.module.css";

export default function BnsSearchPage() {
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [queryIsActive, setQueryIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [queryHistory, setQueryHistory] = useState([]);
    const [mounted, setMounted] = useState(false);
    const searchParam = useStore((state) => state.searchparam);
    const lang = useStore((state) => state.languages);
    const messageEndRef = useRef(null);

    const vectorHandler = useCallback(async (querys) => {
        setLoading(true);
        setSearchResult([]);
        console.log("Initiating vector search for query:", querys);
        const res = await fetch("/api/embed/vector_search_data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: querys,
            }),
        });
        const data = await res.json();
        const results = Array.isArray(data?.searchResult) ? data.searchResult : [];
        if (!results.length) {
            setSearchResult([]);
            setLoading(false);
            return;
        }
        const acts = results.map((item) => {
            return parseInt(item.payload.section.trim(), 10);
        });
        const newActs = [...new Set(acts)];
        data.searchResult = newActs.map((act) => {
            const item = results.find(
                (item) => parseInt(item.payload.section.trim(), 10) === act
            );
            return { ...item, payload: { ...item.payload, section: act } };
        });
        setSearchResult(data.searchResult); // Append new results like chat
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!searchParam?.trim()) return;
        setQuery(searchParam);
        setQueryIsActive(true);
        setQueryHistory((prev) => [...prev, searchParam.trim()]);
        vectorHandler(searchParam);
    }, [searchParam, vectorHandler]);

    useEffect(() => {
        // Auto-scroll to bottom when new result is added
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [searchResult]);

    useEffect(() => {
        setMounted(true);
    }, []);


    const handleSearch = (e) => {
        if (e?.preventDefault) {
            e.preventDefault();
        }
        if (!query.trim()) return;
        setQueryIsActive(true);
        setQueryHistory((prev) => [...prev, query.trim()]);
        vectorHandler(query);
    };

    return (
        <div className={styles.container}>
            <div className={styles.results}>
                {queryIsActive && loading && <LoadingCard />}

                {queryHistory.map((q, index) => (
                    <motion.div
                        key={`q-${index}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                        className={styles.userBubble}
                    >
                        {q}
                    </motion.div>
                ))}

                {searchResult?.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.aiBubble}
                    >
                        <div className={styles.aiHeader}>
                            <span className={styles.aiLabel}>AI Response</span>
                            <span className={styles.score}>Score: {item.score?.toFixed(2)}</span>
                        </div>
                        {/* Typing effect here */}
                        <div className={styles.section}>धारा : {item.payload?.section}</div>
                        <TypingText text={item.payload?.section_content} />
                    </motion.div>
                ))}

                <div ref={messageEndRef} />
            </div>

            {mounted &&
                createPortal(
                    <form
                        onSubmit={handleSearch}
                        className={styles.footer}
                    >
                        <div className={styles.footerInner}>
                            <div className={styles.inputShell}>
                                <input
                                    type="text"
                                    placeholder="Search Bns Act and Query"
                                    className={styles.input}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className={styles.submit}
                                    onClick={handleSearch}
                                >
                                   AI Search
                                </button>
                            </div>
                        </div>
                    </form>,
                    document.body
                )}
        </div>
    );
}
