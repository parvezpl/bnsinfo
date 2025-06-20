'use client';
import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSearchParams } from 'next/navigation';
import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';

export default function Page({ params }) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit,
      TextStyle
    ],
    content: '',
    

  });

  useEffect(() => {
    if (id) {
      fetch(`/api/bns/bnsen/?id=${id}`)
        .then(res => res.json())
        .then(data => {
          console.log('Fetched data:', data.bns.sections[0].section);
          setSection(data.bns.sections[0].section);
          editor?.commands.setContent(data.bns.sections[0].section_title || '');
          setLoading(false);
        });
    }
  }, [id, editor]);

  const saveContent = async () => {
    const html = editor.getHTML();
    console.log('Saving content:', html);
    // await fetch(`/api/bns/bnsen/?id=${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content: html, id }),
    // });
    alert('Saved!');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Section {section}</h1>
      
      <EditorContent editor={editor} />
      <button onClick={saveContent} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </div>
  );
}
