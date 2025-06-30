'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Button } from '@/components/ui/button';

export default function EditContent({ section }) {
  const [savedContent, setSavedContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#24AA09');
  const [selectedSize, setSelectedSize] = useState('16px');
  const [updateStatus, setUpdateStatus] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit, Bold, Underline, TextStyle, Color],
    content: section?.modify_section || section.section_content || section.section_title , // fallback to empty string
  });

  // Update editor content when section changes
  useEffect(() => {
    if (editor && section?.section_title) {
      editor.commands.setContent(section?.modify_section || section.section_content || section.section_title);
    }
  }, [editor, section]);

  if (!editor) return <div>Loading Editor...</div>;

  const savehandler = async () => {
    setSavedContent(editor.getHTML());
    const res = await fetch('/api/bns/bnsenglish/bnsen', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editor.getHTML(), id: section.section }),
    });
    const response = await res.json();
    console.log(response);
    setUpdateStatus('Content Updated Successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className=' text-center font-bold'>SECTION : {section.section}</h1>
      <div className="border p-4 rounded-xl shadow min-h-fit">
        <EditorContent editor={editor} className="min-h-fit p-2 border rounded" />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 place-content-end place-items-center">
        <Button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </Button>

        <input
          type="color"
          value={selectedColor}
          onChange={(e) => {
            setSelectedColor(e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
          className="w-12 h-12 border p-1 rounded-sm"
          title="Pick Text Color"
        />

        <select
          value={selectedSize}
          onChange={(e) => {
            setSelectedSize(e.target.value);
            editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run();
          }}
          className="border rounded"
        >
          <option value="12px">Small</option>
          <option value="16px">Normal</option>
          <option value="20px">Large</option>
          <option value="24px">Extra Large</option>
        </select>

        <Button onClick={savehandler}>
          Save Content
        </Button>
      </div>

      {updateStatus && (
        <div className="mt-4 text-green-600 font-medium">
          {updateStatus}
        </div>
      )}
    </div>
  );
}
