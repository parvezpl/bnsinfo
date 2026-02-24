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
    const [error, setError] = useState("");
    const [queryHistory, setQueryHistory] = useState([]);
    const [mounted, setMounted] = useState(false);
    const searchParam = useStore((state) => state.searchparam);
    const messageEndRef = useRef(null);

    const vectorHandler = useCallback(async (querys) => {
        setLoading(true);
        setSearchResult([]);
        setError("");

        try {
            const res = await fetch("/api/semantic/hindi-search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: querys,
                    limit: 1,
                }),
            });
            const data = await res.json();
            if (!res.ok || data?.ok === false) {
                throw new Error(data?.error || "Semantic search request failed.");
            }

            const results = Array.isArray(data?.searchResult) ? data.searchResult : [];
            if (!results.length) {
                setSearchResult([]);
                return;
            }

            const seenSections = new Set();
            const dedupedResults = results.filter((item) => {
                const key = String(item?.payload?.section ?? item?.id ?? "").trim();
                if (!key) return true;
                if (seenSections.has(key)) return false;
                seenSections.add(key);
                return true;
            });
            setSearchResult(dedupedResults.slice(0, 1));
        } catch (err) {
            setError(err?.message || "Search failed.");
            setLoading(false);
            return;
        }

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
                {queryIsActive && !!error && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.aiBubble}
                    >
                        <div className={styles.aiHeader}>
                            <span className={styles.aiLabel}>AI Response</span>
                        </div>
                        <div>{error}</div>
                    </motion.div>
                )}

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
