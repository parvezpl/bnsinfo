'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import getHindiEmbedding from '../../../utils/HindiEmbedding';

const FONT_SIZES = ['14px', '16px', '18px', '20px', '24px'];

const getInitialContent = (section) =>
  section?.modify_section || section?.section_content || section?.section_title || '';

const getDraftKey = (sectionId) => `bns-editor-draft-${sectionId}`;

function ToolButton({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      className={`edit-tool-btn ${active ? 'is-active' : ''}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

export default function EditContent({ section }) {
  const [selectedColor, setSelectedColor] = useState('#148152');
  const [selectedSize, setSelectedSize] = useState('16px');
  const [updateStatus, setUpdateStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState('edit');
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const [hasDraft, setHasDraft] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Bold,
      Underline,
      TextStyle,
      Color,
    ],
    content: getInitialContent(section),
    editorProps: {
      attributes: {
        class: 'edit-prose',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const text = currentEditor.getText() || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setStats({ words, chars: text.length });

      if (typeof window !== 'undefined' && section?.section) {
        localStorage.setItem(getDraftKey(section.section), currentEditor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (!editor || !section?.section) return;

    const fallbackContent = getInitialContent(section);
    let content = fallbackContent;

    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem(getDraftKey(section.section));
      if (draft && draft.trim()) {
        content = draft;
        setHasDraft(true);
      } else {
        setHasDraft(false);
      }
    }

    editor.commands.setContent(content);
  }, [editor, section]);

  if (!editor) return <div className="edit-loading">Loading editor...</div>;

  const clearDraft = () => {
    if (typeof window === 'undefined' || !section?.section) return;
    localStorage.removeItem(getDraftKey(section.section));
    setHasDraft(false);
  };

  const restoreOriginal = () => {
    editor.commands.setContent(getInitialContent(section));
    clearDraft();
    setUpdateStatus({ type: 'info', text: 'Original content restored.' });
  };

  const discardDraft = () => {
    clearDraft();
    setUpdateStatus({ type: 'info', text: 'Draft removed.' });
  };

  const savehandler = async () => {
    const html = editor.getHTML();
    setIsSaving(true);
    setUpdateStatus(null);

    try {
      const res = await fetch('/api/bns/bnshindi/bnshi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: html, id: section.section }),
      });

      if (!res.ok) throw new Error('Failed to update section content');

      const vector = await getHindiEmbedding(html);
      const vectorRes = await fetch('/api/embed/updatehindivector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: section.section,
          vector,
          payload: { section: section.section, section_content: html },
        }),
      });

      if (!vectorRes.ok) throw new Error('Failed to update embedding vector');

      clearDraft();
      setUpdateStatus({ type: 'success', text: 'Content updated successfully.' });
    } catch (err) {
      setUpdateStatus({ type: 'error', text: err.message || 'Update failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-shell">
      <div className="edit-head">
        <div>
          <h1 className="edit-title">Section {section.section}</h1>
          <p className="edit-subtitle">
            Rich text editor with inline formatting, preview, and local draft recovery.
          </p>
        </div>
        <div className="edit-stats">
          <span>{stats.words} words</span>
          <span>{stats.chars} chars</span>
        </div>
      </div>

      <div className="edit-toolbar">
        <ToolButton
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </ToolButton>
        <ToolButton
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </ToolButton>
        <ToolButton
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </ToolButton>
        <ToolButton
          title="Bullet List"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </ToolButton>
        <ToolButton
          title="Numbered List"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </ToolButton>
        <ToolButton
          title="Heading"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolButton>
        <ToolButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </ToolButton>
        <ToolButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </ToolButton>

        <input
          type="color"
          value={selectedColor}
          onChange={(e) => {
            setSelectedColor(e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
          className="edit-color"
          title="Pick text color"
        />

        <select
          value={selectedSize}
          onChange={(e) => {
            setSelectedSize(e.target.value);
            editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run();
          }}
          className="edit-select"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              Font {size}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={`edit-tab-btn ${tab === 'edit' ? 'is-active' : ''}`}
          onClick={() => setTab('edit')}
        >
          Edit
        </button>
        <button
          type="button"
          className={`edit-tab-btn ${tab === 'preview' ? 'is-active' : ''}`}
          onClick={() => setTab('preview')}
        >
          Preview
        </button>
      </div>

      <div className="edit-panel">
        {tab === 'edit' ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="edit-preview" dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
        )}
      </div>

      <div className="edit-actions">
        <button type="button" className="edit-ghost-btn" onClick={restoreOriginal}>
          Restore Original
        </button>
        <button type="button" className="edit-ghost-btn" onClick={discardDraft} disabled={!hasDraft}>
          Discard Draft
        </button>
        <button type="button" className="edit-primary-btn" onClick={savehandler} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Content'}
        </button>
      </div>

      {updateStatus && <div className={`edit-status ${updateStatus.type}`}>{updateStatus.text}</div>}
    </div>
  );
}
