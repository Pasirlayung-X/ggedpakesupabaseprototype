
import React, { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Page } from '../App';

interface HeaderProps {
  user: User;
  isLoggedIn: boolean; // Tambahkan prop ini
  activePage: Page;
  onNavigate: (main: Page['main'], sub?: string) => void;
  onLogout: () => void; // Tambahkan prop ini
}

const NavItem: React.FC<{
  page: Page['main'];
  activePage: Page;
  onClick: (page: Page['main']) => void;
  children: React.ReactNode;
}> = ({ page, activePage, onClick, children }) => {
  const isActive = page === activePage.main;
  const activeClasses = "text-emerald-600 font-semibold";
  const inactiveClasses = "text-gray-600 hover:text-emerald-600";

  return (
    <button
      onClick={() => onClick(page)}
      className={`px-3 py-2 text-sm transition-colors duration-200 flex items-center ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ user, isLoggedIn, activePage, onNavigate, onLogout }) => {
  const handleMainPageClick = (page: Page['main']) => {
    onNavigate(page); // Navigasi langsung ke halaman utama yang konsolidasi tanpa sub-path
  };

  const username = user.user_metadata?.username || 'Tamu'; // Ambil username dari user_metadata

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('beranda')}>
            {/* Mengganti teks h1 dengan tag img untuk logo */}
            {/* Pastikan file gambar diberi nama 'logo.png' dan diletakkan di folder public/root */}
            <img 
              src="./logo.png" 
              alt="GG-ed Logo" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>
          
          <nav className="hidden lg:flex items-center space-x-1">
            <NavItem page="beranda" activePage={activePage} onClick={() => onNavigate('beranda')}>Beranda</NavItem>
            
            {/* Navigasi langsung ke halaman konsolidasi */}
            <NavItem page="grk" activePage={activePage} onClick={() => handleMainPageClick('grk')}>GRK</NavItem>
            <NavItem page="metana" activePage={activePage} onClick={() => handleMainPageClick('metana')}>Metana</NavItem>
            <NavItem page="solusi" activePage={activePage} onClick={() => handleMainPageClick('solusi')}>Solusi</NavItem>
            
            {/* NavItem untuk "Tentang GG-ed" */}
            <NavItem page="tentang" activePage={activePage} onClick={() => handleMainPageClick('tentang')}>Tentang GG-ed</NavItem>
            
             <button
              onClick={() => onNavigate('checklist')}
              className={`ml-4 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${activePage.main === 'checklist' ? 'bg-amber-400 text-gray-900 shadow-md' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
            >
              Checklist Harian
            </button>
          </nav>

          <div className="flex items-center">
             {/* Tampilkan username dan tombol logout jika sudah login */}
             {isLoggedIn && username !== 'Tamu' && (
               <div className="flex items-center ml-4 space-x-2">
                 <span className="text-gray-700 text-sm font-medium hidden md:block">Halo, {username}!</span>
                 <button
                   onClick={onLogout}
                   className="px-3 py-1 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                 >
                   Logout
                 </button>
               </div>
             )}
             {isLoggedIn && username === 'Tamu' && (
                <div className="flex items-center ml-4 space-x-2">
                 <span className="text-gray-700 text-sm font-medium hidden md:block">Mode Tamu</span>
                 <button
                   onClick={onLogout}
                   className="px-3 py-1 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                 >
                   Logout
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
