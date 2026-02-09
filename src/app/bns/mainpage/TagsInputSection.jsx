import React, { useState } from 'react'
import saveTags from './tagHelper'
export default function TagsInputSection({ section }) {
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleAddTag = () => {
        if (inputValue.trim() !== '') {
            setTags([...tags, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const savetagshandler = async () => {
        const res= await saveTags({ section, tags });
        if (res.results.status === "completed") {
            setTags([])
        }
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Add Tags</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter a tag"
                    className="border rounded px-3 py-1 flex-grow"
                />
                <button
                    onClick={handleAddTag}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                    Add Tag
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {(Array.isArray(tags) && tags.length > 0) &&  tags?.map((tag, index) => (
                    <span key={index} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                        {tag}
                        <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-red-500 hover:text-red-700"
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>
            <button onClick={savetagshandler} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Save Tags
            </button>
        </div>
    )
}
