import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Custom Accordion Section Component
const AccordionSection = ({ title, value, children }) => {
  const [activeSection, setActiveSection] = useState(''); // State to track the active section
  const isActive = activeSection === value; // Check if the current section is active

  return (
    <div className="border rounded-lg mb-4">
      <button
        type="button"
        onClick={() => setActiveSection(isActive ? '' : value)} // Toggle active section
        className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <span className="text-lg font-semibold">{title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'transform rotate-180' : ''}`}
        />
      </button>
      <div
        className={`transition-all duration-200 overflow-hidden ${
          isActive ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 border-t">{children}</div>
      </div>
    </div>
  );
};

export default AccordionSection;
