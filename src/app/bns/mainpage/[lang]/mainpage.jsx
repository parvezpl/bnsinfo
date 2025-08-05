'use client';

import { useEffect, useState } from 'react';
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
    const [mobileOpen, setMobileOpen] = useState(false);
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
            setPage(currentPage); // Set current page from server
            setHasMore(newSections.length >= limit);
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
        setMobileOpen(false);
    };

    const openForEdit = (id) => {
        setEditActive(true);
    };

    const getContent = () => {
        if (activeSection !== null) {
            const section = data.find(s => s.section === activeSection);
            if (!section) return <p className="text-gray-500">Section not found</p>;

            if (editActive) {
                return <EditContent section={section} />;
            }

            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">SECTION: {section.section}</h2>
                        {session?.user?.role === 'admin' && (
                            <span className="text-blue-500 cursor-pointer" onClick={() => openForEdit(section.section)}>
                                Edit ✏️
                            </span>
                        )}
                    </div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: section.modify_section || section.section_content || section.section_title,
                        }}
                        className="prose max-w-none"
                    />
                    {
                        session?.user?.role === 'admin' && (
                            <div className="mt-4">
                                <button 
                                onClick={() => setTagBox(true)}
                                className="mt-2 bg-blue-500 text-[10px] text-white py-1 px-2 rounded">Tags</button>
                            </div>
                        )
                    }
                    {tagBox && (
                        <div className="mt-4">
                            <TagsInputSection section={section.section} />
                        </div>
                    )}
                </motion.div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
                {data.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                        onClick={() => handleSectionClick(section.section)}
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            {lang === 'en' ? 'SECTION' : 'धारा'} : {section.section}
                        </h3>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: section.modify_section || section.section_content || section.section_title,
                            }}
                            className="prose max-w-none line-clamp-3 text-gray-600"
                        />
                    </motion.div>
                ))}

                {hasMore && !loading && (
                    <button
                        onClick={handleLoadMore}
                        className="col-span-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Load More
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="flex relative min-h-full bg-gray-50 overflow-hidden">
            <button
                className="fixed mt-2 right-2 bg-black text-white rounded-sm px-2 py-1 hover:bg-gray-800"
                onClick={() => {
                    setActiveSection(null);
                    setEditActive(false);
                    if (!activeSection) return;
                    router.back();
                }}
            >
                Back
            </button>

            {/* Sidebar */}
            <div
                style={{ height: '100vh', height: '-webkit-fill-available' }}
                className={`fixed md:static flex flex-col left-0 box-content w-40 sm:w-60 border-r bg-white p-2 shadow transition-all ease-in-out duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div className="flex md:hidden bg-gray-200 mb-1">
                    <button onClick={() => setMobileOpen(false)} className="text-gray-600 flex items-center">
                        <PanelLeftClose className="h-4 w-4 mr-2" /> Close
                    </button>
                </div>

                <h2 className="text-md sm:text-xl font-bold pb-2 uppercase place-self-center">Sections</h2>

                <ul className="flex-1 overflow-auto no-scrollbar">
                    {data.map((section, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleSectionClick(section.section)}
                                className="w-full text-left font-medium py-1 sm:p-2 rounded hover:bg-gray-200"
                            >
                                {lang === 'en' ? 'Section' : 'धारा'}: {section.section}
                            </button>
                        </li>
                    ))}
                    {hasMore && !loading && (
                        <button
                            onClick={handleLoadMore}
                            className="col-span-full bg-blue-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
                        >
                            Load More
                        </button>
                    )}
                </ul>
            </div>

            {/* Content Area */}
            <div className="flex-1 ml-0 md:ml-0 p-4 h-full w-screen overflow-y-auto bg-gray-50">
                {/* Mobile Menu Button */}
                <div className="md:hidden mb-4">
                    <button onClick={() => setMobileOpen(true)} className="text-gray-600 flex items-center">
                        <Menu className="h-6 w-6 mr-2" /> Open Sections
                    </button>
                </div>

                <h1 className="text-3xl font-bold mb-6 text-center">BNS 2023</h1>

                {loading && page === 1 ? <LoadingCard /> : getContent()}

                {loading && page > 1 && (
                    <div className="text-center mt-4 text-blue-500 font-medium">Loading more...</div>
                )}
            </div>
        </div>
    );
}
