'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useStore from '../../../../store/useStore';
import './search_comp.css';

export default function Search_comp() {
  const [query, setQuery] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatItems, setChatItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const setSearchbtn = useStore((state) => state.setSearchbtn);
  const chatEndRef = useRef(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!popupOpen) return;
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatItems, chatLoading, popupOpen]);

  useEffect(() => {
    if (!popupOpen) return undefined;

    const original = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };

    scrollYRef.current = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = original.position;
      document.body.style.top = original.top;
      document.body.style.width = original.width;
      document.body.style.overflow = original.overflow;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [popupOpen]);

  async function runSemanticSearch(text) {
    setChatLoading(true);
    try {
      const res = await fetch('/api/semantic/hindi-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, limit: 1 }),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || 'Search failed.');
      }

      const best = Array.isArray(data?.searchResult) ? data.searchResult[0] : null;
      if (!best) {
        setChatItems((prev) => [
          ...prev,
          {
            role: 'ai',
            section: null,
            score: null,
            text: 'इस प्रश्न के लिए उपयुक्त परिणाम नहीं मिला।',
          },
        ]);
        return;
      }

      setChatItems((prev) => [
        ...prev,
        {
          role: 'ai',
          section: best?.payload?.section || '',
          score: best?.score,
          text: best?.payload?.section_content || 'कोई सामग्री उपलब्ध नहीं है।',
        },
      ]);
    } catch (error) {
      setChatItems((prev) => [
        ...prev,
        {
          role: 'ai',
          section: null,
          score: null,
          text: error?.message || 'Search failed.',
          isError: true,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) return;
    setSearchbtn(cleaned);
    setPopupOpen(true);
    setChatItems((prev) => [...prev, { role: 'user', text: cleaned }]);
    setQuery('');
    runSemanticSearch(cleaned);
  };

  return (
    <>
      <section className="search-wrap">
        <div className="search-shell">
          <div className="search-grid">
            <div className="search-head">
              <div className="search-badge">AI Legal Search</div>
              <h3>Find BNS Sections Fast</h3>
              <p>
                Ask in Hindi or English. Search by section number, keyword, or full
                legal query.
              </p>
              <div className="search-tags">
                <span>धारा 302</span>
                <span>हत्या का प्रयास</span>
                <span>Cyber fraud law</span>
              </div>
            </div>

            <form onSubmit={handleSearch} className="search-form">
              <Input
                type="text"
                placeholder="Try: धारा 420 क्या है?"
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" className="search-btn">
                Search with AI
              </Button>
            </form>
          </div>
        </div>
      </section>

      {mounted &&
        popupOpen &&
        createPortal(
          <div className="chat-overlay" onClick={() => setPopupOpen(false)}>
            <section
              className="chat-popup"
              onClick={(e) => e.stopPropagation()}
              aria-label="AI chat popup"
            >
              <header className="chat-head">
                <div>
                  <strong>AI BNS Assistant</strong>
                  <div className="chat-sub">Semantic result chat</div>
                </div>
                <button
                  className="chat-close"
                  type="button"
                  onClick={() => setPopupOpen(false)}
                >
                  ✕
                </button>
              </header>

              <div className="chat-body">
                {chatItems.map((item, idx) => (
                  <article
                    key={`${item.role}-${idx}`}
                    className={item.role === 'user' ? 'chat-msg user' : 'chat-msg ai'}
                  >
                    {item.role === 'ai' && item.section ? (
                      <div className="chat-meta">
                        धारा: {item.section}
                        {Number.isFinite(Number(item.score))
                          ? ` | score: ${Number(item.score).toFixed(2)}`
                          : ''}
                      </div>
                    ) : null}
                    <div className={item.isError ? 'chat-text error' : 'chat-text'}>
                      {item.text}
                    </div>
                  </article>
                ))}
                {chatLoading && (
                  <article className="chat-msg ai">
                    <div className="chat-text">सोच रहा हूँ...</div>
                  </article>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSearch} className="chat-input-row">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="अपना सवाल लिखें..."
                  className="chat-input"
                />
                <button type="submit" className="chat-send">
                  भेजें
                </button>
              </form>
            </section>
          </div>,
          document.body
        )}
    </>
  );
}
