
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
import AIChat from './components/ai/AIChat';
import TextSelectionHandler from './components/ai/TextSelectionHandler';


// Import halaman konsolidasi yang baru
import SemuaGRK from './pages/grk/SemuaGRK';
import SemuaMetana from './pages/metana/SemuaMetana';
import SemuaSolusi from './pages/solusi/SemuaSolusi';
import LeaderboardPage from './pages/LeaderboardPage';
import AvatarGalleryPage from './pages/AvatarGalleryPage';
import StudiKasusPage from './pages/StudiKasusPage';

export type Page = {
  main: 'beranda' | 'grk' | 'metana' | 'solusi' | 'checklist' | 'tentang' | 'profile' | 'leaderboard' | 'avatar_gallery' | 'studi_kasus';
  sub?: string;
}

type PostLoginAction = {
    action: 'openChat';
    payload?: { initialPrompt: string };
} | null;


const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [activePage, setActivePage] = useState<Page>({ main: 'beranda' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [profileVersion, setProfileVersion] = useState(0);

  // State untuk AI Chat & Post-Login Actions
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);
  const [postLoginAction, setPostLoginAction] = useState<PostLoginAction>(null);
  const [userAvatarId, setUserAvatarId] = useState('cow-1');

  const fetchUserAvatar = useCallback(async (userId: string) => {
    try {
        const { data } = await supabase
            .from('profiles')
            .select('avatar_id')
            .eq('id', userId)
            .single();
        if (data?.avatar_id) {
            setUserAvatarId(data.avatar_id);
        } else {
            setUserAvatarId('cow-1'); // Default
        }
    } catch (e) {
        console.error("Error fetching user avatar", e);
        setUserAvatarId('cow-1'); // Default on error
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
        fetchUserAvatar(session.user.id);
    }
  }, [session, profileVersion, fetchUserAvatar]);

  const handleOpenChat = () => {
    if (!isLoggedIn) {
        setPostLoginAction({ action: 'openChat' });
        setShowAuthModal(true);
    } else {
        setInitialPrompt(undefined); // Hapus prompt lama saat membuka manual
        setIsChatOpen(true);
    }
  };


  const handleTextSelection = useCallback((text: string) => {
    const prompt = `Jelaskan lebih lanjut tentang ini: "${text}"`;
    if (!isLoggedIn) {
        setPostLoginAction({ action: 'openChat', payload: { initialPrompt: prompt } });
        setShowAuthModal(true);
    } else {
        setInitialPrompt(prompt);
        setIsChatOpen(true);
    }
  }, [!!session]);

  const handleChatClose = () => {
      setIsChatOpen(false);
      if (initialPrompt) {
          setTimeout(() => {
              setInitialPrompt(undefined);
          }, 300);
      }
  };


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
      setPostLoginAction(null); // Clear AI intent
      setShowAuthModal(true);
      setActivePage({ main, sub });
      return; 
    }
    setActivePage({ main, sub });
    window.scrollTo(0, 0);
  };

  const onAuthSuccess = () => {
    setShowAuthModal(false);
    if (postLoginAction?.action === 'openChat') {
        if (postLoginAction.payload?.initialPrompt) {
            setInitialPrompt(postLoginAction.payload.initialPrompt);
        }
        setIsChatOpen(true);
        setPostLoginAction(null);
    } else if (activePage.main === 'checklist' || activePage.main === 'profile') {
      setActivePage({ main: activePage.main });
    } else {
      setActivePage({ main: 'beranda' });
    }
  };

  const onCloseAuthModal = () => {
    setShowAuthModal(false);
    setPostLoginAction(null); // Hapus intent jika modal ditutup
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
    if (main === 'profile') {
      if (!user) return null; // Safety check
      return <ProfilePage user={user} onProfileUpdate={handleProfileUpdate} onNavigate={handleNavigate} />;
    }
    if (main === 'tentang') return <TentangGGEdu />;
    
    if (main === 'grk') return <SemuaGRK onFinish={() => handleNavigate('beranda')} />;
    if (main === 'metana') return <SemuaMetana onFinish={() => handleNavigate('beranda')} />;
    if (main === 'solusi') return <SemuaSolusi onFinish={() => handleNavigate('beranda')} />;
    if (main === 'leaderboard') return <LeaderboardPage />;
    if (main === 'avatar_gallery') return <AvatarGalleryPage user={user!} onNavigate={handleNavigate} />;
    if (main === 'studi_kasus') return <StudiKasusPage />;

    return <Beranda onNavigate={handleNavigate} />;
  };

  if (isLoadingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-emerald-50">Memuat aplikasi...</div>;
  }

  return (
    <div className="min-h-screen progress-background text-gray-800 flex flex-col">
      <NotificationManager userId={session?.user?.id} />
      <TextSelectionHandler onSelect={handleTextSelection} />

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
        <main className="container mx-auto p-4 md:p-8 flex-grow">
          {renderPage()}
        </main>
        <footer className="bg-white mt-12 py-6 border-t border-gray-200">
          <div className="container mx-auto text-center text-sm text-gray-500">
            <p>2025 GreenHouse Gas Edu. For educational purpose.</p>
          </div>
        </footer>
      </div>

      <AIChat 
        isOpen={isChatOpen} 
        onClose={handleChatClose} 
        onOpen={handleOpenChat}
        initialPrompt={initialPrompt}
        isLoggedIn={isLoggedIn}
        userAvatarId={userAvatarId}
      />
    </div>
  );
};

export default App;
