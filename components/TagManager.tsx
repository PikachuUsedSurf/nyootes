'use client';

import { useState } from 'react';

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
        >
          Add
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};