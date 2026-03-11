import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

interface FeedbackPageProps {
  user: User | null;
}

const FeedbackPage: React.FC<FeedbackPageProps> = ({ user }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [description, setDescription] = useState('');
  
  const [nameOption, setNameOption] = useState<'account' | 'manual'>(user ? 'account' : 'manual');
  const [manualName, setManualName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [role, setRole] = useState<'peternak' | 'umum'>('peternak');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setNameOption('account');
      const savedUserStr = localStorage.getItem('gg_edu_user');
      if (savedUserStr) {
        try {
          const savedUser = JSON.parse(savedUserStr);
          setAccountName(savedUser.username || 'Pengguna');
          const localRole = localStorage.getItem(`gg_edu_role_${user.id}`);
          if (localRole === 'umum' || localRole === 'peternak') {
            setRole(localRole);
          }
        } catch (e) {}
      }
    } else {
      setNameOption('manual');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalName = (user && nameOption === 'account') ? accountName : manualName.trim();
    if (!finalName) {
      setMessage({ type: 'error', text: 'Nama tidak boleh kosong.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([
          {
            user_id: user ? user.id : null,
            name: finalName,
            role: role,
            title: title.trim(),
            category: category,
            description: description.trim()
          }
        ]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Terima kasih! Saran Anda telah berhasil dikirim.' });
      setTitle('');
      setCategory('general');
      setDescription('');
      if (!user || nameOption === 'manual') setManualName('');
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setMessage({ type: 'error', text: 'Gagal mengirim saran. Silakan coba lagi nanti.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-page-enter">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-emerald-700 mb-2">Saran & Feedback</h1>
        <p className="text-gray-600">Bantu kami menjadi lebih baik! Bagikan ide, saran, atau laporkan masalah yang Anda temukan.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium transition-all ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Nama Anda</label>
              {user && (
                <div className="flex flex-col space-y-2 mb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={nameOption === 'account'} 
                      onChange={() => setNameOption('account')} 
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4" 
                    />
                    <span className="text-sm text-gray-700">Gunakan nama akun ({accountName})</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={nameOption === 'manual'} 
                      onChange={() => setNameOption('manual')} 
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4" 
                    />
                    <span className="text-sm text-gray-700">Masukkan nama manual</span>
                  </label>
                </div>
              )}
              {(!user || nameOption === 'manual') && (
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Masukkan nama Anda"
                />
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">Peran Anda</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'peternak' | 'umum')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white mt-1 md:mt-0"
              >
                <option value="peternak">Peternak Sapi</option>
                <option value="umum">Masyarakat Umum</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Judul Saran</label>
            <input
              type="text"
              id="title"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Contoh: Tambahkan fitur pengingat notifikasi"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
            >
              <option value="general">Saran Umum</option>
              <option value="feature">Ide Fitur Baru</option>
              <option value="bug">Laporan Bug / Eror</option>
              <option value="content">Koreksi Konten</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Detail Deskripsi</label>
            <textarea
              id="description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-y"
              placeholder="Jelaskan secara detail saran atau masalah yang Anda temukan..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim() || (!user && !manualName.trim()) || (user && nameOption === 'manual' && !manualName.trim())}
              className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 shadow-md disabled:bg-emerald-400 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                'Kirim Saran'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
