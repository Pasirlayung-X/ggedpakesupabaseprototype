
import React, { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { Page } from '../App';
import { renderAvatar } from './AvatarSelector';

interface HeaderProps {
  user: User | null;
  isLoggedIn: boolean;
  activePage: Page;
  onNavigate: (main: Page['main'], sub?: string) => void;
  onLogout: () => void;
  profileVersion?: number; // Used to trigger re-fetch
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

const Header: React.FC<HeaderProps> = ({ user, isLoggedIn, activePage, onNavigate, onLogout, profileVersion }) => {
  const [displayName, setDisplayName] = useState('');
  const [avatarId, setAvatarId] = useState('cow-1');

  useEffect(() => {
    const fetchProfileData = async () => {
        if (!user) return;
        
        try {
            // Coba ambil dari tabel profiles dulu
            const { data, error } = await supabase
                .from('profiles')
                .select('username, avatar_id')
                .eq('id', user.id)
                .single();
            
            if (data) {
                setDisplayName(data.username || user.user_metadata?.username || 'Peternak');
                setAvatarId(data.avatar_id || 'cow-1');
            } else {
                setDisplayName(user.user_metadata?.username || 'Peternak');
                setAvatarId('cow-1');
            }
        } catch (e) {
            console.error("Error fetching header profile", e);
        }
    };

    fetchProfileData();
  }, [user, profileVersion]); // Re-fetch jika user atau profileVersion berubah

  const handleMainPageClick = (page: Page['main']) => {
    onNavigate(page);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('beranda')}>
            <img 
              src="./logo.png" 
              alt="GG-ed Logo" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>
          
          <nav className="hidden lg:flex items-center space-x-1">
            <NavItem page="beranda" activePage={activePage} onClick={() => onNavigate('beranda')}>Beranda</NavItem>
            
            <NavItem page="grk" activePage={activePage} onClick={() => handleMainPageClick('grk')}>GRK</NavItem>
            <NavItem page="metana" activePage={activePage} onClick={() => handleMainPageClick('metana')}>Metana</NavItem>
            <NavItem page="solusi" activePage={activePage} onClick={() => handleMainPageClick('solusi')}>Solusi</NavItem>
            
            <NavItem page="tentang" activePage={activePage} onClick={() => handleMainPageClick('tentang')}>Tentang GG-ed</NavItem>
            
             <button
              onClick={() => onNavigate('checklist')}
              className={`ml-4 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${activePage.main === 'checklist' ? 'bg-amber-400 text-gray-900 shadow-md' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
            >
              Checklist Harian
            </button>
          </nav>

          <div className="flex items-center">
             {isLoggedIn ? (
               <div className="flex items-center ml-4 space-x-3">
                 <button 
                    onClick={() => onNavigate('profile')}
                    className="flex items-center space-x-2 group hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                 >
                     <div className="bg-emerald-100 rounded-full p-0.5 border border-emerald-200 group-hover:border-emerald-400">
                        {renderAvatar(avatarId, "w-8 h-8")}
                     </div>
                     <span className="text-gray-700 text-sm font-medium hidden md:block group-hover:text-emerald-700">
                         {displayName}
                     </span>
                 </button>
                 
                 <button
                   onClick={onLogout}
                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                   title="Keluar"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6 0H9" />
                   </svg>
                 </button>
               </div>
             ) : (
                <div className="ml-4">
                    {/* Placeholder jika belum login */}
                </div>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
