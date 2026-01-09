
import React from 'react';

/**
 * Komponen Logo GG-ed dalam format SVG.
 * Menggabungkan elemen daun/lingkungan dengan tipografi modern.
 * Warna dapat diubah melalui properti `className` (misal: `text-emerald-700`).
 */
export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 180 50"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="GG-ed Logo"
    {...props}
  >
    {/* 
      Catatan: @import dalam style tag SVG tidak selalu didukung di semua renderer.
      Namun, font 'Inter' sudah diimpor secara global di `index.html`, jadi ini akan berfungsi dengan baik.
    */}
    <style>
      {`
        .logo-text {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 40px;
        }
      `}
    </style>
    
    {/* Elemen Ikon: Daun/Swoosh yang melambangkan alam & pertumbuhan */}
    <path
      d="M25 5 C 5 20, 5 30, 25 45 Q 40 25, 25 5 Z"
      fill="#34D399" // emerald-400
    />
    <path
      d="M15 10 C 0 22, 0 33, 15 40 Q 30 25, 15 10 Z"
      fill="#10B981" // emerald-600
    />

    {/* Teks "GG-ed" */}
    <text x="50" y="40" className="logo-text" fill="currentColor">
      GG-ed
    </text>
  </svg>
);
