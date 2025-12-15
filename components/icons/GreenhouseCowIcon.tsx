
import React from 'react';

export const GreenhouseCowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
    {/* Greenhouse Frame - Dark green outline, uses currentColor for adaptability */}
    <path d="M7.5 20 L7.5 82.5 L92.5 82.5 L92.5 20 L50 7.5 L7.5 20 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M92.5 20 L7.5 82.5 M7.5 20 L92.5 82.5 M50 7.5 L50 82.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Cow Silhouette - Dark green fill, uses currentColor for adaptability */}
    <path d="M25 68 C27 62, 35 60, 40 68 C43 75, 38 80, 25 80 C20 80, 18 75, 25 68 Z" fill="currentColor"/>

    {/* Swirl 1 (light green) */}
    <path 
      d="M47.5 67 C53 60, 60 55, 65 59 C70 63, 75 66, 80 62" 
      stroke="#84D2AE" /* --color-swirl1-light */
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Swirl 2 (light blue) */}
    <path 
      d="M47.5 69 C53 64, 60 59, 65 63 C70 67, 75 70, 80 66" 
      stroke="#AEDDDB" /* --color-swirl2-light */
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Leaf shape - Dark green */}
    <path 
      d="M70 54 C75 49, 78 44, 75 39 C72 34, 68 39, 70 44 C72 49, 65 54, 70 54 Z" 
      fill="#2E6C4D" /* --color-leaf-light */
    /> 

    {/* Green Molecular Shapes */}
    <g 
      fill="#6BBE6E" /* --color-mol-green-light */ 
      stroke="#6BBE6E" /* --color-mol-green-light */ 
      strokeWidth="1"
    >
        <circle cx="70" cy="18" r="3"/>
        <circle cx="75" cy="13" r="2"/>
        <circle cx="65" cy="13" r="2"/>
        <path d="M70 18 L75 13 L65 13 L70 18 Z"/>

        <circle cx="55" cy="28" r="3"/>
        <circle cx="60" cy="23" r="2"/>
        <circle cx="50" cy="23" r="2"/>
        <path d="M55 28 L60 23 L50 23 L55 28 Z"/>
    </g>

    {/* Light Blue Molecular Shapes */}
    <g 
      fill="#A8DCDA" /* --color-mol-blue-light */ 
      stroke="#A8DCDA" /* --color-mol-blue-light */ 
      strokeWidth="1"
    >
        <circle cx="85" cy="23" r="3"/>
        <circle cx="90" cy="18" r="2"/>
        <circle cx="80" cy="18" r="2"/>
        <path d="M85 23 L90 18 L80 18 L85 23 Z"/>

        <circle cx="80" cy="35" r="3"/>
        <circle cx="85" cy="30" r="2"/>
        <circle cx="75" cy="30" r="2"/>
        <path d="M80 35 L85 30 L75 30 L80 35 Z"/>

        <circle cx="70" cy="40" r="3"/>
        <circle cx="75" cy="35" r="2"/>
        <circle cx="65" cy="35" r="2"/>
        <path d="M70 40 L75 35 L65 35 L70 40 Z"/>
    </g>
  </svg>
);