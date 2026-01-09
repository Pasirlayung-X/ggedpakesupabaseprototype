
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface AuthComponentProps {
  onAuthSuccess: (username?: string) => void;
  onClose: () => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ onAuthSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const authUsername = username.trim();

    try {
      if (isLogin) {
        // Mode Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email, // Supabase butuh email, bukan username untuk login default
          password: password,
        });

        if (error) throw error;
        
        if (data.user) {
           setMessage(`Selamat datang kembali!`);
           // Beri sedikit jeda agar user bisa membaca pesan sukses
           setTimeout(() => {
             onAuthSuccess(data.user?.user_metadata?.username);
           }, 500);
        }

      } else {
        // Mode Daftar
        if (!email.trim() || !authUsername || !password.trim()) {
          throw new Error('Semua field harus diisi.');
        }

        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: authUsername, // Simpan username di metadata
            },
          },
        });

        if (error) throw error;

        if (data.user) {
            setMessage(`Pendaftaran berhasil! Selamat datang, ${authUsername}.`);
            setTimeout(() => {
                onAuthSuccess(authUsername);
            }, 500);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan saat autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setMessage(null);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg transform scale-100 opacity-100 transition-all duration-300 ease-out relative">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
          aria-label="Tutup"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <span className="text-6xl" role="img" aria-label="cow emoji">🐄</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Masuk dengan email Anda untuk melanjutkan.' : 'Bergabunglah untuk peternakan yang lebih baik.'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Field Email selalu dibutuhkan untuk Supabase Auth standar */}
            <div>
                <input
                id="email-auth"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Alamat Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            
            {/* Username hanya diminta saat Daftar (atau jika ingin login by username, butuh logika khusus di backend/edge function, kita pakai email untuk login sederhana) */}
            {!isLogin && (
                <div>
                <input
                    id="username-signup"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Nama Pengguna (untuk tampilan)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>
            )}

            <div>
                <input
                id="password-auth"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Kata sandi (min. 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {message && <p className="text-sm text-green-600 text-center">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
            >
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
            </button>
          </div>
        </form>
        
        <div className="text-sm text-center">
          <button
            onClick={handleSwitchMode}
            className="font-medium text-green-600 hover:text-green-500"
          >
            {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
