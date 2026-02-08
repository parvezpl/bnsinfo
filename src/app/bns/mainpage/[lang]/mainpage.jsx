'use client';

import { useEffect, useState } from 'react';
import './mainpage.css';
import { Menu, PanelLeftClose } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingCard from '../../../../components/loading';
import EditContent from './EditContent';
import { useSession } from 'next-auth/react';
import TagsInputSection from './TagsInputSection';

export default function Mainpage({ result, currentPage, lang }) {
    const { data: session } = useSession();
    const [data, setData] = useState([]);
    const [activeSection, setActiveSection] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(currentPage || 1);
    const [hasMore, setHasMore] = useState(true);
    const [editActive, setEditActive] = useState(false);
    const [tagBox, setTagBox] = useState(false);

    const router = useRouter();
    const limit = 4;

    useEffect(() => {
        if (result?.bns?.length) {
            const newSections = result.bns.flatMap(item => item.sections);
            setData(newSections);
            setPage(currentPage || 1); // Set current page from server
            setHasMore(newSections.length >= limit);
        } else {
            setData([]);
            setHasMore(false);
        }
    }, [lang, result, currentPage]);

    const fetchData = async (pageToFetch) => {
        setLoading(true);
        try {
            const url =
                lang === 'en'
                    ? `/api/bns/bnsenglish/bnsen?page=${pageToFetch}&limit=${limit}`
                    : `/api/bns/bnshindi/bnshi?page=${pageToFetch}&limit=${limit}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch page ${pageToFetch}`);
            }
            const newResult = await response.json();

            if (newResult?.bns?.length) {
                const newSections = newResult.bns.flatMap(item => item.sections);
                setData(prev => [...prev, ...newSections]);

                if (newSections.length < limit) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error loading more:', err);
            setHasMore(false);
        }
        setLoading(false);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage);
    };

    const handleSectionClick = (sectionId) => {
        setActiveSection(sectionId);
        setEditActive(false);
        setTagBox(false);
        setMobileOpen(false);
    };

    const openForEdit = () => {
        setEditActive(true);
        setTagBox(false);
    };

    const getContent = () => {
        if (activeSection !== null) {
            const section = data.find(s => s.section === activeSection);
            if (!section) return <p className="bns-muted">Section not found</p>;

            if (editActive) {
                return <EditContent section={section} />;
            }

            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bns-detail"
                >
                    <div className="bns-detail-head">
                        <h2 className="bns-detail-title">SECTION: {section.section}</h2>
                        {session?.user?.role === 'admin' && (
                            <span className="bns-edit" onClick={() => openForEdit(section.section)}>
                                Edit ✏️
                            </span>
                        )}
                    </div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: section.modify_section || section.section_content || section.section_title,
                        }}
                        className="bns-prose"
                    />
                    {session?.user?.role === 'admin' && (
                        <div className="bns-spacer">
                            <button
                                onClick={() => setTagBox(prev => !prev)}
                                className="bns-tag-btn"
                            >
                                {tagBox ? 'Hide Tags' : 'Tags'}
                            </button>
                        </div>
                    )}
                    {tagBox && (
                        <div className="bns-spacer">
                            <TagsInputSection section={section.section} />
                        </div>
                    )}
                </motion.div>
            );
        }

        return (
            <div className="bns-grid">
                {data.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bns-card"
                        onClick={() => handleSectionClick(section.section)}
                    >
                        <h3 className="bns-card-title">
                            {lang === 'en' ? 'SECTION' : 'धारा'} : {section.section}
                        </h3>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: section.modify_section || section.section_content || section.section_title,
                            }}
                            className="bns-card-text"
                        />
                    </motion.div>
                ))}

                {hasMore && !loading && (
                    <button
                        onClick={handleLoadMore}
                        className="bns-load"
                    >
                        Load More
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="bns-main">
            <button
                className="bns-back"
                onClick={() => {
                    if (activeSection !== null) {
                        setActiveSection(null);
                        setEditActive(false);
                        setTagBox(false);
                        return;
                    }
                    router.back();
                }}
            >
                Back
            </button>

            {/* Sidebar */}
            <div
                style={{ height: '100vh', height: '-webkit-fill-available' }}
                className={`bns-sidebar ${mobileOpen ? 'bns-sidebar-open' : 'bns-sidebar-closed'}`}
            >
                <div className="bns-mobile-only bns-sidebar-close">
                    <button onClick={() => setMobileOpen(false)} className="bns-close">
                        <PanelLeftClose className="h-4 w-4 mr-2" /> Close
                    </button>
                </div>

                <h2 className="bns-sidebar-title">Sections</h2>

                <ul className="bns-sidebar-list">
                    {data.map((section, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleSectionClick(section.section)}
                                className="bns-section-btn"
                            >
                                {lang === 'en' ? 'Section' : 'धारा'}: {section.section}
                            </button>
                        </li>
                    ))}
                    {hasMore && !loading && (
                        <button
                            onClick={handleLoadMore}
                            className="bns-load bns-load-sidebar"
                        >
                            Load More
                        </button>
                    )}
                </ul>
            </div>

            {/* Content Area */}
            <div className="bns-content">
                {/* Mobile Menu Button */}
                <div className="bns-mobile-only bns-menu-wrap">
                    <button onClick={() => setMobileOpen(true)} className="bns-menu">
                        <Menu className="h-6 w-6 mr-2" /> Open Sections
                    </button>
                </div>

                <h1 className="bns-page-title">BNS 2023</h1>

                {loading && page === 1 ? <LoadingCard /> : getContent()}

                {loading && page > 1 && (
                    <div className="bns-loading">Loading more...</div>
                )}
            </div>
        </div>
    );
}
