'use client';
import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useParams } from 'next/navigation';
import TextStyle from '@tiptap/extension-text-style';
import { FontSize } from "@/lib/tiptap/FontSize";


export default function Page() {
  const params = useParams();
  const id = params.id;
  const { ids, lang } = JSON.parse(decodeURIComponent(id));
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit,
      TextStyle
    ],
    FontSize,
    content: '',
    editorOptions: {
      immediatelyRender: false,
    },

  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
         await fetch(lang === 'en' ? `/api/bns/bnsen/?id=${ids}` : `/api/bns/bnshindi/bnshi/?id=${ids}`)
            .then(res => res.json())
            .then(data => {
              setSection(data.bns.sections[0].section);
              editor?.commands.setContent(data.bns.sections[0].section_title || data.bns.sections[0].section_content);
              setLoading(false);
            });
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [id, editor]);

  const saveContent = async () => {
    const html = editor.getHTML();
    console.log('Saving content:', html);
    await fetch(`/api/bns/bnsen/?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: html, id }),
    });
    alert('Saved!');
  };

  if (loading) return <p className='text-center'>Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-justify">Edit Section {section}</h1>
      <select
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        className="border rounded px-2 py-1"
      >
        <option value="">Font Size</option>
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="24px">24</option>
        <option value="32px">32</option>
      </select>

      <EditorContent editor={editor} className=' text-justify ' />
      <button onClick={saveContent} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
      <button
        onClick={() => window.history.back()}
        className="mt-4 ml-2 bg-gray-600 text-white px-4 py-2 rounded"  
      >
        Back
      </button>
    </div>
  );
}
