
import React from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { Page } from '../App';
import { renderAvatar } from './AvatarSelector';
import SultanBadge from './SultanBadge';

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
  const [displayName, setDisplayName] = React.useState('');
  const [avatarId, setAvatarId] = React.useState('cow-1');
  const [xp, setXp] = React.useState(0);
  const [level, setLevel] = React.useState(1);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchProfileData = async () => {
        if (!user) return;
        
        try {
            const { data } = await supabase
                .from('profiles')
                .select('username, avatar_id, xp, level')
                .eq('id', user.id)
                .single();
            
            if (data) {
                const localRole = localStorage.getItem(`gg_edu_role_${user.id}`);
                setDisplayName(data.username || (localRole === 'umum' ? 'Pejuang Lingkungan' : 'Peternak'));
                setAvatarId(data.avatar_id || 'cow-1');
                setXp(data.xp || 0);
                setLevel(data.level || 1);
            }
        } catch (e) {
            console.error("Error fetching header profile", e);
        }
    };

    fetchProfileData();
  }, [user, profileVersion]);

  const handleMainPageClick = (page: Page['main']) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer transform hover:scale-105 transition-transform" onClick={() => onNavigate('beranda')}>
            <img src="/gg-ed.svg" alt="Logo GG-ed" className="h-10 md:h-12 w-auto" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavItem page="beranda" activePage={activePage} onClick={() => onNavigate('beranda')}>Beranda</NavItem>
            <NavItem page="grk" activePage={activePage} onClick={() => handleMainPageClick('grk')}>GRK</NavItem>
            <NavItem page="metana" activePage={activePage} onClick={() => handleMainPageClick('metana')}>Metana</NavItem>
            <NavItem page="solusi" activePage={activePage} onClick={() => handleMainPageClick('solusi')}>Solusi</NavItem>
            <NavItem page="tentang" activePage={activePage} onClick={() => handleMainPageClick('tentang')}>Tentang GG-ed</NavItem>
            <a href="/feedback" target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm transition-colors duration-200 flex items-center text-gray-600 hover:text-emerald-600 font-semibold">
              Saran
            </a>
            
             <button
              onClick={() => onNavigate('checklist')}
              className={`ml-4 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${activePage.main === 'checklist' ? 'bg-amber-400 text-gray-900' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
            >
              Checklist Harian
            </button>
          </nav>

          {/* Right Section: Profile or Auth Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
             {isLoggedIn ? (
               <div className="flex items-center space-x-2 md:space-x-3">
                 <button 
                    onClick={() => onNavigate('profile')}
                    className="flex items-center space-x-2 group hover:bg-gray-50 p-1 md:p-1.5 rounded-xl transition-all border border-transparent hover:border-gray-100"
                 >
                     <div className="bg-emerald-50 rounded-full p-0.5 border border-emerald-100 group-hover:border-emerald-300 transition-colors">
                        {renderAvatar(avatarId, "w-7 h-7 md:w-9 md:h-9")}
                     </div>
                     <div className="hidden sm:flex flex-col items-start">
                        <span className="text-gray-800 text-xs md:text-sm font-bold group-hover:text-emerald-700 flex items-center">
                            {displayName}
                            {displayName.toLowerCase() === 'dyas ganteng' && <SultanBadge />}
                        </span>
                        <div className="w-16 md:w-20 bg-gray-200 rounded-full h-1 md:h-1.5 mt-0.5 md:mt-1">
                            <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${(xp % 100)}%` }}></div>
                        </div>
                     </div>
                 </button>
                 
                 <button
                   onClick={onLogout}
                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                   title="Keluar"
                 >
                   <span className="text-lg md:text-xl" role="img" aria-label="logout">🚪</span>
                 </button>
               </div>
             ) : (
                <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onNavigate('profile')} // Profile page triggers auth if not logged in
                      className="px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      Masuk
                    </button>
                    <button 
                      onClick={() => onNavigate('profile')}
                      className="px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                      Daftar
                    </button>
                </div>
             )}

             {/* Mobile Menu Button */}
             <button 
               className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 {isMenuOpen ? (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 )}
               </svg>
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-page-enter shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <button onClick={() => handleMainPageClick('beranda')} className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">Beranda</button>
            <button onClick={() => handleMainPageClick('grk')} className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">GRK</button>
            <button onClick={() => handleMainPageClick('metana')} className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">Metana</button>
            <button onClick={() => handleMainPageClick('solusi')} className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">Solusi</button>
            <button onClick={() => handleMainPageClick('tentang')} className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">Tentang GG-ed</button>
            <a href="/feedback" target="_blank" rel="noopener noreferrer" className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl">Saran & Feedback</a>
            <div className="pt-4">
              <button 
                onClick={() => handleMainPageClick('checklist')}
                className="w-full py-3 text-center font-bold text-gray-900 bg-amber-400 rounded-xl shadow-sm"
              >
                Checklist Harian
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
