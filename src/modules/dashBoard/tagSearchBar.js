import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const TagSearchBar = ({ dashboarddata, onSelectionChange, selectedOptions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(dashboarddata)) {
      setFilteredTags(
        dashboarddata.filter(
          (tag) =>
            tag.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedTags.includes(tag.value)
        )
      );
    }
  }, [searchTerm, selectedTags, dashboarddata]);

  const handleTagSelect = (tag) => {
    const updatedTags = [...selectedTags, tag.value];
    setSelectedTags(updatedTags);
    setSearchTerm('');
    onSelectionChange(updatedTags);
  };

  const handleTagRemove = (tagValue) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagValue);
    setSelectedTags(updatedTags);
    onSelectionChange(updatedTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && searchTerm === '' && selectedTags.length > 0) {
      // Remove the last selected tag when backspace is pressed and the input is empty
      handleTagRemove(selectedTags[selectedTags.length - 1]);
    } else if (e.key === 'Enter' && filteredTags.length > 0) {
      // Select the first filtered tag when enter is pressed
      handleTagSelect(filteredTags[0]);
    }
  };

  const handleMouseDown = (e) => {
    e.stopPropagation(); // Ensure this component is clicked, not the one behind it
  };

  return (
    <div className="z-50 relative w-full" ref={searchRef} onMouseDown={handleMouseDown}>
      <div className="z-50 flex flex-wrap items-center p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {selectedOptions.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full"
          >
            {tag}
            <button
              onClick={() => handleTagRemove(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <div className="relative flex-grow min-w-[120px] z-50">
          <input
            type="text"
            className="w-full p-1 focus:outline-none"
            placeholder="Select tags for filtering KPI's..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setDropdownVisible(true)}
            onKeyDown={handleKeyDown} // Add keydown handler
          />
          {dropdownVisible && filteredTags.length > 0 && (
            <ul className="absolute z-50 w-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredTags.map((tag) => (
                <li
                  key={tag.key}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer z-50"
                  onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
                  onMouseUp={(e) => e.preventDefault()} // Prevent losing focus
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagSearchBar;
