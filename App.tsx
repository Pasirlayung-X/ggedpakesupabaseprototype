
import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './services/supabase.ts';
import Header from './components/Header.tsx';
import Beranda from './pages/Beranda.tsx';
import ChecklistPage from './pages/ChecklistPage.tsx';
import TentangGGEdu from './pages/TentangGGEdu.tsx';
import AuthComponent from './components/Auth.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import NotificationManager from './components/NotificationManager.tsx';

// Import halaman konsolidasi yang baru
import SemuaGRK from './pages/grk/SemuaGRK.tsx';
import SemuaMetana from './pages/metana/SemuaMetana.tsx';
import SemuaSolusi from './pages/solusi/SemuaSolusi.tsx';

export type Page = {
  main: 'beranda' | 'grk' | 'metana' | 'solusi' | 'checklist' | 'tentang' | 'profile';
  sub?: string;
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [activePage, setActivePage] = useState<Page>({ main: 'beranda' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  
  // State untuk memicu refresh header saat profil diupdate
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setActivePage({ main: 'beranda' });
      }
    });

    return () => subscription.unsubscribe();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const handleProfileUpdate = () => {
      setProfileVersion(v => v + 1);
  };

  const renderPage = () => {
    const { main } = activePage;
    const user = session?.user || null;

    if (main === 'beranda') return <Beranda onNavigate={handleNavigate} />;
    if (main === 'checklist') return <ChecklistPage user={user} isLoggedIn={isLoggedIn} />;
    if (main === 'profile') return <ProfilePage user={user} onProfileUpdate={handleProfileUpdate} />;
    if (main === 'tentang') return <TentangGGEdu />;
    
    if (main === 'grk') return <SemuaGRK onFinish={() => handleNavigate('beranda')} />;
    if (main === 'metana') return <SemuaMetana onFinish={() => handleNavigate('beranda')} />;
    if (main === 'solusi') return <SemuaSolusi onFinish={() => handleNavigate('beranda')} />;

    return <Beranda onNavigate={handleNavigate} />;
  };

  if (isLoadingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-emerald-50">Memuat aplikasi...</div>;
  }

  return (
    <div className="min-h-screen progress-background text-gray-800 flex flex-col">
      {/* Logic Only Component */}
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
          profileVersion={profileVersion} // Pass version to force re-fetch in Header if needed
        />
        <main className="container mx-auto p-4 md:p-8 flex-grow">
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
