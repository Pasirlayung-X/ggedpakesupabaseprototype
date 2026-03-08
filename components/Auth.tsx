
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface AuthComponentProps {
  onAuthSuccess: (username?: string) => void;
  onClose: () => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ onAuthSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'peternak' | 'umum'>('peternak');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login Logic: Cari di tabel profiles
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email.trim())
          .eq('password', password) // Catatan: Dalam produksi, gunakan hashing!
          .single();

        if (fetchError || !data) {
          throw new Error('Email atau kata sandi salah.');
        }

        const user = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: localStorage.getItem(`gg_edu_role_${data.id}`) || 'peternak', // Fallback to local storage or default
          isLocal: true
        };
        
        localStorage.setItem('gg_edu_user', JSON.stringify(user));
        onAuthSuccess(data.username);
      } else {
        // Signup Logic: Simpan ke tabel profiles
        if (!username.trim()) throw new Error('Nama pengguna harus diisi.');
        
        // Cek apakah email sudah terdaftar
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email.trim())
          .maybeSingle();
          
        if (existing) throw new Error('Email sudah terdaftar.');

        const newId = crypto.randomUUID();
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: newId,
              email: email.trim(),
              password: password,
              username: username.trim(),
              avatar_id: 'cow-1',
              xp: 0,
              level: 1
            }
          ]);

        if (insertError) throw insertError;

        const user = {
          id: newId,
          username: username.trim(),
          email: email.trim(),
          role: role,
          isLocal: true
        };
        
        localStorage.setItem(`gg_edu_role_${newId}`, role);
        localStorage.setItem('gg_edu_user', JSON.stringify(user));
        onAuthSuccess(username.trim());
      }
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg relative animate-page-enter">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full p-1"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/gg-ed.svg" alt="Logo GG-ed" className="h-16 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Selamat Datang Kembali' : 'Bergabung Sekarang'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {isLogin ? 'Masuk untuk melanjutkan petualanganmu.' : 'Daftar untuk mulai belajar tentang GRK.'}
          </p>
        </div>
        
        <form className="space-y-4" onSubmit={handleAuth}>
          <div className="space-y-3">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nama Pengguna</label>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm bg-gray-50"
                    placeholder="Contoh: Peternak Muda"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Peran Anda</label>
                  <select
                    className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm bg-gray-50"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'peternak' | 'umum')}
                  >
                    <option value="peternak">Peternak Sapi</option>
                    <option value="umum">Masyarakat Umum</option>
                  </select>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm bg-gray-50"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm bg-gray-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 transition-all shadow-md"
            >
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar Sekarang')}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
          >
            {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
