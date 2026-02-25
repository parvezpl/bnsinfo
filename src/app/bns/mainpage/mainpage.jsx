'use client';

import { useEffect, useMemo, useState } from 'react';
import './mainpage.css';
import { Menu, PanelLeftClose } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingCard from '../../../components/loading';
import EditContent from './EditContent';
import { useSession } from 'next-auth/react';
import TagsInputSection from './TagsInputSection';

const extractSections = (payload) => {
    if (!payload?.bns?.length) return [];
    return payload.bns.flatMap((item) => item.sections || []);
};

const getDefaultSectionId = (sections, preferred) => {
    if (!sections.length) return null;
    if (preferred !== null && preferred !== undefined && preferred !== '') {
        const found = sections.find((s) => String(s.section) === String(preferred));
        if (found) return found.section;
    }
    return sections[0].section;
};

const getSectionBody = (section) =>
    section?.modify_section || section?.section_content || section?.section_title || '';

const hasHtmlMarkup = (value) => /<\/?[a-z][\s\S]*>/i.test(String(value || ''));

export default function Mainpage({ result, currentPage, initialSection }) {
    const { data: session } = useSession();
    const [data, setData] = useState(() => extractSections(result));
    const [activeSection, setActiveSection] = useState(() =>
        getDefaultSectionId(extractSections(result), initialSection)
    );
    const [mobileOpen, setMobileOpen] = useState(true);
    const [loading] = useState(false);
    const [page, setPage] = useState(currentPage || 1);
    const [editActive, setEditActive] = useState(false);
    const [tagBox, setTagBox] = useState(false);
    const [sectionFilter, setSectionFilter] = useState('');

    const router = useRouter();

    useEffect(() => {
        const prevHtmlOverflow = document.documentElement.style.overflow;
        const prevBodyOverflow = document.body.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = prevHtmlOverflow;
            document.body.style.overflow = prevBodyOverflow;
        };
    }, []);

    useEffect(() => {
        const newSections = extractSections(result);
        if (newSections.length) {
            setData(newSections);
            setPage(currentPage || 1);
            setActiveSection((prev) => getDefaultSectionId(newSections, initialSection ?? prev));
        } else {
            setData([]);
            setActiveSection(null);
        }
    }, [result, currentPage, initialSection]);

    const buildSectionHref = (sectionId) =>
        `?page=${encodeURIComponent(String(page || 1))}&section=${encodeURIComponent(String(sectionId))}`;

    const filteredSections = useMemo(() => {
        const query = sectionFilter.trim().toLowerCase();
        if (!query) return data;
        return data.filter((section) => {
            const haystack = [
                section?.section,
                section?.section_title,
                section?.section_content,
                section?.modify_section,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(query);
        });
    }, [data, sectionFilter]);

    const handleSectionClick = (sectionId) => {
        setActiveSection(sectionId);
        setEditActive(false);
        setTagBox(false);
        router.push(buildSectionHref(sectionId), { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openForEdit = () => {
        setEditActive(true);
        setTagBox(false);
    };

    const getContent = () => {
        const section = data.find(s => String(s.section) === String(activeSection));
        if (!section) return <p className="bns-muted">धारा नहीं मिली</p>;

        if (editActive) {
            return <EditContent section={section} />;
        }

        const sectionBody = getSectionBody(section);
        const renderAsHtml = hasHtmlMarkup(sectionBody);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bns-detail"
            >
                <div className="bns-detail-head">
                    <h2 className="bns-detail-title">धारा: {section.section}</h2>
                    {session?.user?.role === 'admin' && (
                        <span className="bns-edit" onClick={() => openForEdit(section.section)}>
                            संपादित करें ✏️
                        </span>
                    )}
                </div>
                {renderAsHtml ? (
                    <div
                        dangerouslySetInnerHTML={{ __html: sectionBody }}
                        className="bns-prose"
                    />
                ) : (
                    <div className="bns-prose bns-prose-text">{sectionBody}</div>
                )}
                {session?.user?.role === 'admin' && (
                    <div className="bns-spacer">
                        <button
                            onClick={() => setTagBox(prev => !prev)}
                            className="bns-tag-btn"
                        >
                            {tagBox ? 'टैग छिपाएं' : 'टैग'}
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
    };

    return (
        <div className="bns-main">
            <button
                className="bns-back"
                onClick={() => {
                    router.back();
                }}
            >
                वापस जाएं
            </button>

            <div
                style={{ height: '100vh', height: '-webkit-fill-available' }}
                className={`bns-sidebar ${mobileOpen ? 'bns-sidebar-open' : 'bns-sidebar-closed'}`}
            >
                <div className="bns-mobile-only bns-sidebar-close">
                    <button onClick={() => setMobileOpen(false)} className="bns-close">
                        <PanelLeftClose className="h-4 w-4 mr-2" /> बंद करें
                    </button>
                </div>

                <h2 className="bns-sidebar-title">धाराएं</h2>
                <input
                    type="text"
                    className="bns-sidebar-filter"
                    placeholder="धारा खोजें..."
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                />

                <ul className="bns-sidebar-list">
                    {filteredSections.map((section, index) => (
                        <li key={index}>
                            <a
                                href={buildSectionHref(section.section)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSectionClick(section.section);
                                }}
                                className={`bns-section-btn ${String(activeSection) === String(section.section) ? 'is-active' : ''}`}
                            >
                                धारा: {section.section}
                            </a>
                        </li>
                    ))}
                    {!filteredSections.length && (
                        <li className="bns-muted">कोई धारा नहीं मिली</li>
                    )}
                </ul>
            </div>

            <div className="bns-content">
                <div className="bns-mobile-only bns-menu-wrap">
                    <button onClick={() => setMobileOpen(true)} className="bns-menu">
                        <Menu className="h-6 w-6 mr-2" /> धाराएं खोलें
                    </button>
                </div>

                <h1 className="bns-page-title">भारतीय न्याय संहिता 2023</h1>

                {loading && page === 1 ? <LoadingCard /> : getContent()}

                {loading && page > 1 && (
                    <div className="bns-loading">लोड हो रहा है...</div>
                )}
            </div>
        </div>
    );
}
