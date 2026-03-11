
import React, { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './services/supabase';
import Header from './components/Header';
import Beranda from './pages/Beranda';
import ChecklistPage from './pages/ChecklistPage';
import TentangGGEdu from './pages/TentangGGEdu';
import AuthComponent from './components/Auth';
import ProfilePage from './pages/ProfilePage';
import NotificationManager from './components/NotificationManager';

// Import halaman konsolidasi yang baru
import SemuaGRK from './pages/grk/SemuaGRK';
import SemuaMetana from './pages/metana/SemuaMetana';
import SemuaSolusi from './pages/solusi/SemuaSolusi';
import AvatarGalleryPage from './pages/AvatarGalleryPage';
import FeedbackPage from './pages/FeedbackPage';

export type Page = {
  main: 'beranda' | 'grk' | 'metana' | 'solusi' | 'checklist' | 'tentang' | 'profile' | 'avatar_gallery';
  sub?: string;
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const isFeedbackRoute = window.location.pathname === '/feedback';
  const [activePage, setActivePage] = useState<Page>({ main: 'beranda' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [profileVersion, setProfileVersion] = useState(0);

  const fetchUserAvatar = useCallback(async (userId: string) => {
    try {
        const { data } = await supabase
            .from('profiles')
            .select('avatar_id')
            .eq('id', userId)
            .single();
        // This function can be used elsewhere if needed, but the direct avatarId is no longer in this component's state.
    } catch (e) {
        console.error("Error fetching user avatar", e);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
        fetchUserAvatar(session.user.id);
    }
  }, [session, profileVersion, fetchUserAvatar]);

  useEffect(() => {
    // Cek login lokal dari localStorage
    const savedUser = localStorage.getItem('gg_edu_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setSession({ user } as any);
      } catch (e) {
        console.error("Error parsing saved user", e);
      }
    }
    setIsLoadingSession(false);
  }, []);

  const isLoggedIn = !!session;

  const handleNavigate = (main: Page['main'], sub?: string) => {
    if ((main === 'checklist' || main === 'profile') && !isLoggedIn) {
      setShowAuthModal(true);
      setActivePage({ main, sub });
      return; 
    }
    setActivePage({ main, sub });
    window.scrollTo(0, 0);
  };

  const onAuthSuccess = () => {
    const savedUser = localStorage.getItem('gg_edu_user');
    if (savedUser) {
      setSession({ user: JSON.parse(savedUser) } as any);
    }
    
    setShowAuthModal(false);
    if (activePage.main === 'checklist' || activePage.main === 'profile') {
      setActivePage({ main: activePage.main });
    } else {
      setActivePage({ main: 'beranda' });
    }
  };

  const onCloseAuthModal = () => {
    setShowAuthModal(false);
    if ((activePage.main === 'checklist' || activePage.main === 'profile') && !isLoggedIn) {
      setActivePage({ main: 'beranda' });
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('gg_edu_user');
    setSession(null);
    setActivePage({ main: 'beranda' });
  };
  
  const handleProfileUpdate = () => {
      setProfileVersion(v => v + 1);
  };

  const renderPage = () => {
    const { main } = activePage;
    const user = session?.user || null;
    const userRole = (user as any)?.role || 'peternak';

    if (main === 'beranda') return <Beranda onNavigate={handleNavigate} userRole={userRole} />;
    if (main === 'checklist') return <ChecklistPage user={user} isLoggedIn={isLoggedIn} />;
    if (main === 'profile') {
      if (!user) return null; // Safety check
      return <ProfilePage user={user} onProfileUpdate={handleProfileUpdate} onNavigate={handleNavigate} />;
    }
    if (main === 'tentang') return <TentangGGEdu />;
    
    if (main === 'grk') return <SemuaGRK onFinish={() => handleNavigate('beranda')} userRole={userRole} />;
    if (main === 'metana') return <SemuaMetana onFinish={() => handleNavigate('beranda')} userRole={userRole} />;
    if (main === 'solusi') return <SemuaSolusi onFinish={() => handleNavigate('beranda')} userRole={userRole} />;
    if (main === 'avatar_gallery') return <AvatarGalleryPage user={user!} onNavigate={handleNavigate} />;

    return <Beranda onNavigate={handleNavigate} userRole={userRole} />;
  };

  if (isLoadingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-emerald-50">Memuat aplikasi...</div>;
  }

  if (isFeedbackRoute) {
    return (
      <div className="min-h-screen progress-background text-gray-800 flex flex-col">
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
            <a href="/" className="flex items-center cursor-pointer transform hover:scale-105 transition-transform">
              <img src="/gg-ed.svg" alt="Logo GG-ed" className="h-10 md:h-12 w-auto" />
            </a>
            <a href="/" className="text-sm font-bold text-emerald-700 hover:text-emerald-800">
              &larr; Kembali ke Aplikasi
            </a>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6 md:px-8 md:py-10 flex-grow max-w-3xl w-full">
           <FeedbackPage user={session?.user || null} />
        </main>
        <footer className="bg-white mt-12 py-6 border-t border-gray-200">
          <div className="container mx-auto text-center text-sm text-gray-500">
            <p>2025 GreenHouse Gas Edu. For educational purpose.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen progress-background text-gray-800 flex flex-col">
      <NotificationManager userId={session?.user?.id} />

      {showAuthModal && (
        <AuthComponent onAuthSuccess={onAuthSuccess} onClose={onCloseAuthModal} />
      )}
      
      <div>
        <Header 
          user={session?.user || null}
          isLoggedIn={isLoggedIn}
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          profileVersion={profileVersion}
        />
        <main className="container mx-auto px-4 py-6 md:px-8 md:py-10 flex-grow max-w-7xl">
          {renderPage()}
        </main>
        <footer className="bg-white mt-12 py-6 border-t border-gray-200">
          <div className="container mx-auto text-center text-sm text-gray-500">
            <p>2025 GreenHouse Gas Edu. For educational purpose.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
