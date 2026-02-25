
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  // FIX: Explicitly declaring 'props' to ensure TypeScript recognizes it.
  // In standard React TypeScript, this declaration is usually not needed as 'props' is inherited from Component.
  public readonly props: Readonly<Props>;

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isConfigError = this.state.error?.message.includes('Supabase URL/Key is not configured');
      
      if (isConfigError) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-orange-50 text-orange-900 p-4">
            <div className="max-w-2xl w-full p-8 bg-white rounded-2xl shadow-lg border-2 border-orange-200 text-center">
              <h1 className="text-2xl font-bold mb-4 text-orange-700">Langkah Terakhir: Hubungkan Aplikasi ke Supabase Anda</h1>
              <p className="mb-6 text-gray-700">
                Aplikasi ini hampir siap! Anda hanya perlu menghubungkannya ke database Supabase Anda untuk menyimpan semua data pengguna dan progres.
              </p>
              <div className="bg-orange-100 p-4 rounded-lg text-left">
                <p className="font-semibold text-lg">Apa yang harus dilakukan:</p>
                <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-600">
                  <li>Buka dasbor proyek Supabase Anda.</li>
                  <li>Pergi ke <strong>Settings</strong> (ikon gerigi) &gt; <strong>API</strong>.</li>
                  <li>
                    Di sana Anda akan menemukan <strong>Project URL</strong> dan <strong>Project API Keys</strong> (gunakan kunci <code className="bg-orange-200 text-orange-800 p-1 rounded font-mono text-xs">anon</code> <code className="bg-orange-200 text-orange-800 p-1 rounded font-mono text-xs">public</code>).
                  </li>
                  <li>
                    Salin kedua nilai tersebut dan berikan kepada saya di chat.
                  </li>
                </ol>
              </div>
               <p className="mt-6 text-sm text-gray-500">
                Setelah saya memasukkan kredensial Anda, aplikasi akan berfungsi sepenuhnya.
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-800">
            <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-xl font-bold mb-4">Oops! Terjadi Kesalahan</h1>
                <p>Aplikasi mengalami masalah. Silakan coba segarkan halaman.</p>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
