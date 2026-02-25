
import React, { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from '../icons/SparkleIcon';

interface TextSelectionHandlerProps {
  onSelect: (text: string) => void;
}

const TextSelectionHandler: React.FC<TextSelectionHandlerProps> = ({ onSelect }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      // Tunggu sebentar untuk memastikan seleksi selesai
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim() || '';

        if (text && text.length > 5 && text.length < 500) {
            const range = selection?.getRangeAt(0);
            if(range) {
                const rect = range.getBoundingClientRect();
                // Periksa apakah seleksi ada di dalam area konten utama
                const mainContent = document.querySelector('main');
                if (mainContent && mainContent.contains(range.commonAncestorContainer)) {
                    setSelectedText(text);
                    setPosition({
                        top: rect.bottom + window.scrollY + 5,
                        left: rect.left + window.scrollX + rect.width / 2,
                    });
                } else {
                     setPosition(null);
                }
            }
        } else {
          setPosition(null);
        }
      }, 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
            setPosition(null);
        }
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAskAI = () => {
    if (selectedText) {
      onSelect(selectedText);
    }
    setPosition(null);
  };
  
  if (!position) return null;

  return (
    <div
        ref={tooltipRef}
        className="fixed z-[100] p-1"
        style={{ top: `${position.top}px`, left: `${position.left}px`, transform: 'translateX(-50%)' }}
    >
        <button
            onClick={handleAskAI}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg shadow-2xl border border-gray-600 hover:bg-gray-700 transition-all transform hover:scale-105 animate-page-enter"
            style={{ animationDuration: '0.2s' }}
        >
            <SparkleIcon className="w-4 h-4 text-yellow-300" />
            <span className="text-xs font-semibold">Tanya AI</span>
        </button>
    </div>
  );
};

export default TextSelectionHandler;
