
import React from 'react';

/**
 * Komponen Logo GG-ed profesional.
 * Menggabungkan ikon daun (lingkungan) dengan tipografi modern untuk melambangkan
 * edukasi gas rumah kaca (Greenhouse Gas Education).
 */
export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 180 50"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="GG-ed Logo"
    {...props}
  >
    <style>
      {`
        .logo-text {
          font-family: 'Inter', sans-serif;
          font-weight: 800; /* Extra Bold */
          font-size: 40px;
          fill: currentColor;
        }
      `}
    </style>
    
    {/* Ikon Daun */}
    <g transform="translate(5,2)">
       <path
        d="M20,45 C5,35 5,15 20,5 C35,15 35,35 20,45 Z"
        fill="#34D399" /* emerald-400 */
      />
      <path
        d="M20,45 C25,30 25,20 20,5"
        stroke="#ECFDF5" /* emerald-50 */
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </g>

    {/* Teks "GG-ed" */}
    <text x="50" y="40" className="logo-text">
      GG-ed
    </text>
  </svg>
);
