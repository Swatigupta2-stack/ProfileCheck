import { useState } from 'react';

export default function TagInput({ tags = [], onTagsChange }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().replace(/,$/, '');
      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInput('');
    }
  };

  const removeTag = (index) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-900 border border-gray-700 rounded min-h-10">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-forge-gold text-deep-ink px-2 py-1 rounded text-sm flex items-center gap-1"
        >
          {tag}
          <button
            onClick={() => removeTag(index)}
            className="hover:text-gray-700 font-bold ml-1"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? 'Press Enter or comma to add...' : ''}
        className="bg-transparent border-none outline-none text-sm flex-1 min-w-20"
      />
    </div>
  );
}
