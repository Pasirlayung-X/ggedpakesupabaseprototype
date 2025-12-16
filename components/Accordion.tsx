
import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string; // For custom styling on the accordion container
  headerClassName?: string; // For custom styling on the header button
  contentClassName?: string; // For custom styling on the content div
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`border border-gray-200 rounded-lg mb-4 bg-white overflow-hidden ${className}`}>
      <button
        className={`flex justify-between items-center w-full p-4 text-left font-semibold text-lg text-gray-800 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 ${headerClassName}`}
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {/* 
        Teknik CSS Grid Animation:
        Transisi dari 0fr (tinggi 0) ke 1fr (tinggi konten penuh).
        Cara ini menjamin konten tidak pernah terpotong (cut-off) karena browser menghitung tinggi '1fr' berdasarkan konten sebenarnya.
      */}
      <div 
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        } ${contentClassName}`}
      >
        <div className="overflow-hidden">
          <div className="p-4 border-t border-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
