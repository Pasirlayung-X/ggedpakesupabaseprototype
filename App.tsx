import React, { useState, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import Header from './components/Header';
import Beranda from './pages/Beranda';
import ChecklistPage from './pages/ChecklistPage';
import TentangGGEdu from './pages/TentangGGEdu';
import AuthComponent from './components/Auth'; // Import AuthComponent

// Import halaman konsolidasi yang baru
import SemuaGRK from './pages/grk/SemuaGRK';
import SemuaMetana from './pages/metana/SemuaMetana';
import SemuaSolusi from './pages/solusi/SemuaSolusi';

export type Page = {
  main: 'beranda' | 'grk' | 'metana' | 'solusi' | 'checklist' | 'tentang';
  sub?: string; // Sub-page is now optional for consolidated pages
}

const App: React.FC = () => {
  // Buat sesi dummy dengan useRef agar user_metadata bisa diupdate
  // Dipindahkan ke dalam komponen App agar useRef dipanggil dengan benar
  const dummySession = useRef<Session>({
    access_token: 'dummy-access-token',
    token_type: 'bearer',
    user: {
      id: 'dummy-user-id',
      app_metadata: {},
      // Inisialisasi username default agar Header bisa menampilkan "Tamu" atau nama pengguna
      user_metadata: { username: 'Tamu' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
    refresh_token: 'dummy-refresh-token',
    expires_in: 3600,
  });

  const [activePage, setActivePage] = useState<Page>({ main: 'beranda' });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk melacak status login
  const [showAuthModal, setShowAuthModal] = useState(false); // State untuk mengontrol visibilitas modal auth

  const handleNavigate = (main: Page['main'], sub?: string) => {
    // Jika mencoba mengakses checklist dan belum login, tampilkan modal auth
    if (main === 'checklist' && !isLoggedIn) {
      setShowAuthModal(true);
      // PENTING: Atur activePage ke 'checklist' di sini.
      // Ini memastikan ChecklistPage dirender di belakang modal login,
      // sehingga efek blur dan overlaynya terlihat.
      setActivePage({ main, sub });
      return; // Hentikan navigasi normal, biarkan AuthComponent yang mengontrol
    }
    setActivePage({ main, sub });
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const onAuthSuccess = (username?: string) => {
    setIsLoggedIn(true);
    setShowAuthModal(false); // Tutup modal setelah login berhasil
    // Perbarui user_metadata di dummySession
    if (username) {
      dummySession.current.user.user_metadata.username = username;
    } else {
      dummySession.current.user.user_metadata.username = 'Tamu'; // Default untuk guest mode
    }
    // Setelah login berhasil, arahkan ke halaman checklist jika itu tujuan yang diblokir
    // atau ke beranda jika login dilakukan dari modal tanpa tujuan spesifik.
    if (activePage.main === 'checklist') {
      setActivePage({ main: 'checklist' }); // Langsung arahkan ke checklist
    } else {
      setActivePage({ main: 'beranda' }); // Default ke beranda
    }
  };

  const onCloseAuthModal = () => {
    setShowAuthModal(false);
    // Jika modal ditutup tanpa login, kembali ke halaman beranda
    setActivePage({ main: 'beranda' });
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Hapus username dari dummy user metadata saat logout
    dummySession.current.user.user_metadata.username = 'Tamu'; // Reset ke 'Tamu' atau kosongkan
    // Arahkan kembali ke beranda setelah logout
    handleNavigate('beranda');
  };

  const renderPage = () => {
    const { main } = activePage;

    if (main === 'beranda') return <Beranda onNavigate={handleNavigate} />;
    if (main === 'checklist') return <ChecklistPage user={dummySession.current.user} isLoggedIn={isLoggedIn} />;
    if (main === 'tentang') return <TentangGGEdu />;
    
    if (main === 'grk') return <SemuaGRK onFinish={() => handleNavigate('beranda')} />;
    if (main === 'metana') return <SemuaMetana onFinish={() => handleNavigate('beranda')} />;
    if (main === 'solusi') return <SemuaSolusi onFinish={() => handleNavigate('beranda')} />;

    return <Beranda onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen progress-background text-gray-800 flex flex-col">
      {showAuthModal && ( // Render AuthComponent hanya jika showAuthModal true
        <AuthComponent onAuthSuccess={onAuthSuccess} onClose={onCloseAuthModal} />
      )}
      
      {/* Konten utama aplikasi tidak lagi diburamkan oleh status isLoggedIn di level App */}
      <div>
        <Header 
          user={dummySession.current.user} // Gunakan dummySession.current.user
          isLoggedIn={isLoggedIn} // Teruskan status login ke Header
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout} // Teruskan fungsi logout
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