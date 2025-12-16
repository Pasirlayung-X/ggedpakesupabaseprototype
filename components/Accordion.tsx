
import React, { useState, useRef, useEffect } from 'react';

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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      // 1. OPENING: Set height eksplisit ke scrollHeight untuk memicu transisi CSS
      // Inline style ini akan meng-override class 'max-h-0' jika ada
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.opacity = '1';

      // 2. FINISHED: Setelah durasi transisi (300ms), hapus batasan height
      // Ini penting agar konten tidak terpotong jika browser di-resize (responsive)
      const timer = setTimeout(() => {
        // Cek kembali apakah masih terbuka untuk menghindari race condition
        if (el.style.maxHeight !== '0px') {
            el.style.maxHeight = 'none';
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      // 1. CLOSING: Jika saat ini 'none' (terbuka penuh), kita harus set ke pixel dulu
      // agar transisi ke 0px bisa berjalan (animasi 'none' ke '0px' tidak jalan di CSS)
      if (el.style.maxHeight === 'none' || !el.style.maxHeight) {
        el.style.maxHeight = `${el.scrollHeight}px`;
        // Force reflow agar browser sadar height sudah berubah menjadi pixel sebelum kita nol-kan
        void el.offsetHeight;
      }

      // 2. Set ke 0 untuk menutup
      requestAnimationFrame(() => {
        el.style.maxHeight = '0px';
        el.style.opacity = '0';
      });
    }
  }, [isOpen]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden mb-4 ${className}`}>
      <button
        className={`flex justify-between items-center w-full p-4 text-left font-semibold text-lg text-gray-800 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 ${headerClassName}`}
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        ref={contentRef}
        // Gunakan class max-h-0 HANYA untuk state awal jika defaultOpen=false.
        // Selanjutnya logika JS di useEffect akan menghandle inline style yang meng-override class ini.
        className={`transition-all duration-300 ease-in-out ${!defaultOpen ? 'max-h-0 opacity-0' : ''} ${contentClassName}`}
        style={{ overflow: 'hidden' }}
      >
        <div className="p-4 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
