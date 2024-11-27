import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ResponseCarousel = ({ summary, tableData, graphData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { type: 'summary', content: summary },
    { type: 'table', content: tableData },
    { type: 'graph', content: graphData },
  ];

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const renderContent = (item) => {
    switch (item.type) {
      case 'summary':
        return <p className="text-gray-700">{item.content}</p>;
      case 'table':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr key={item}>
                <td className="p-2 border">"hello"</td>
                <td className="p-2 border">"world"</td>
              </tr>
            </tbody>
          </table>
        );
      case 'graph':
        return (
          <div className="h-40 flex items-end justify-around">
            <h1>Hello</h1>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-md">
      <div className="relative h-fit pb-36">
        <div className="absolute inset-0 flex items-center justify-center">
          {renderContent(items[activeIndex])}
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="flex justify-center mt-2">
        {items.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${index === activeIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ResponseCarousel;