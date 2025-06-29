'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingCard from '../../../../components/loading';

export default function Page() {
    const [data, setData] = useState([]);
    const [activeSection, setActiveSection] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    const limit = 4; // Items per page
    const lang = useParams().lang || 'en';
    const router = useRouter();

    useEffect(() => {
        fetchData(1, true);
    }, [lang]);

    const fetchData = async (pageNumber, reset = false) => {
        setLoading(true);
        try {
            const response = lang === 'en' ? await fetch(`/api/bns/bnsenglish/bnsen?page=${pageNumber}&limit=${limit}`) : await fetch(`/api/bns/bnshindi/bnshi?page=${pageNumber}&limit=${limit}`);
            const result = await response.json();

            if (result?.bns?.length) {
                const newSections = result.bns.flatMap(item => item.sections);
                if (reset) {
                    setData(newSections);
                } else {
                    setData(prev => [...prev, ...newSections]);
                }

                // Assuming API gives total count or you can use length check
                if (newSections.length < limit) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
        const obj = { ids: id, lang: lang };
        const encodedObj = encodeURIComponent(JSON.stringify(obj));
        router.push(`/bns/bnshome/${encodedObj}`);
    };

    const getContent = () => {
        if (activeSection !== null) {
            const section = data.find(s => s.section === activeSection);
            if (!section) return <p className="text-gray-500">Section not found</p>;

            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">SECTION: {section.section}</h2>
                        <span className="text-blue-500 cursor-pointer" onClick={() => openForEdit(section.section)}>
                            Edit ✏️
                        </span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: section.modify_section || section.section_content || section.section_title }} className="prose max-w-none" />
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
                        <h3 className="text-lg font-semibold mb-2">{lang === 'en' ? 'SECTION' : 'धारा'} : {section.section}</h3>
                        <div dangerouslySetInnerHTML={{ __html: section.modify_section || section.section_content || section.section_title }} className="prose max-w-none line-clamp-3 text-gray-600" />
                    </motion.div>
                ))}

                {hasMore && !loading && (
                    <button onClick={handleLoadMore} className="col-span-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Load More
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className=" bg-gray-50">
            {/* Sidebar */}
            <div style={{ height: '-webkit-fill-available' }}
                className={`fixed md:static left-0 z-40 w-40 sm:w-60 border-r  bg-white p-2  shadow transition-transform duration-300
        ${!mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div className="flex md:hidden justify-end ">
                    <button onClick={() => setMobileOpen(false)} className="text-sm text-red-500">
                        Close ✕
                    </button>
                </div>

                <h2 className="text:md sm:text-xl font-bold pb-2 uppercase">Sections</h2>
                <ul className="max-h-[70vh] sm:h-full  overflow-y-scroll no-scrollbar ">
                    {data.map((section, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleSectionClick(section.section)}
                                className="w-full text-left font-medium py-1 sm:p-2 rounded hover:bg-gray-200"
                            >
                                {lang === "en" ? 'Section' : 'धारा'}: {section.section}
                            </button>
                        </li>
                    ))}
                    {hasMore && !loading && (
                        <button onClick={handleLoadMore} className="col-span-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                            Load More
                        </button>
                    )}
                </ul>
            </div>

            {/* Content Area */}
            <div className=" flex-1 ml-0 md:ml-0 p-4 h-full overflow-y-auto bg-gray-50">
                {/* Mobile Menu Button */}
                <div className="md:hidden mb-4">
                    <button onClick={() => setMobileOpen(true)} className="text-gray-600 flex items-center">
                        <Menu className="h-6 w-6 mr-2" /> Open Menu
                    </button>
                </div>
                <button className='fixed  right-2 bg-black text-white rounded-sm px-2 py-1 hover:bg-gray-800' onClick={() => router.back()}>back</button>
                <h1 className="text-3xl font-bold mb-6 text-center rounded-sm shadow-blue-300 shadow-sm">BNS 2023</h1>

                {loading && page === 1 ? <LoadingCard /> : getContent()}

                {loading && page > 1 && (
                    <div className="text-center mt-4 text-blue-500 font-medium">Loading more...</div>
                )}
            </div>
        </div>
    );
}
