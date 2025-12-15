import React, { useState } from 'react';
import { CowIcon } from './icons/CowIcon';

interface AuthComponentProps {
  onAuthSuccess: (username?: string) => void;
  onClose: () => void; // Tambahkan prop onClose
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

    let authUsername = username.trim();

    if (isLogin) {
      // Validasi untuk mode Login: username dan password
      if (!authUsername || !password.trim()) {
        setError('Nama Pengguna dan Kata Sandi tidak boleh kosong.');
        setLoading(false);
        return;
      }
      // Simulasi login
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMessage(`Selamat datang, ${authUsername}!`);
        onAuthSuccess(authUsername);
      } catch (e) {
        setError('Simulasi error: Nama pengguna atau kata sandi salah.');
      } finally {
        setLoading(false);
      }
    } else {
      // Validasi untuk mode Daftar
      if (!email.trim() || !authUsername || !password.trim()) {
        setError('Semua field harus diisi.');
        setLoading(false);
        return;
      }
      // Simulasi pendaftaran
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMessage(`Pendaftaran ${authUsername} berhasil! Mengalihkan...`);
        onAuthSuccess(authUsername);
      } catch (e) {
        setError('Simulasi error: Pendaftaran gagal.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGuestMode = () => {
    onAuthSuccess('Tamu');
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setMessage(null);
    // Reset semua field saat beralih mode
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
            <CowIcon className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Masuk untuk melanjutkan.' : 'Bergabunglah untuk peternakan yang lebih baik.'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isLogin ? (
              // Mode Login: Username dan Password
              <>
                <div>
                  <input
                    id="username-login"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Nama Pengguna"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    id="password-login"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            ) : (
              // Mode Daftar: Email, Username, Password
              <>
                <div>
                  <input
                    id="email-signup"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Alamat email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    id="username-signup"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Nama Pengguna"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    id="password-signup"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}
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
        <div className="text-center mt-6">
          <button
            onClick={handleGuestMode}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 underline"
          >
            Lanjutkan sebagai Tamu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;