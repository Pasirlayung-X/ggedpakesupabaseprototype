
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
              <h1 className="text-2xl font-bold mb-4 text-orange-700">Kesalahan Konfigurasi Aplikasi</h1>
              <p className="mb-4 text-gray-700">
                Aplikasi ini belum terhubung dengan Supabase. Anda perlu memasukkan kredensial Supabase Anda untuk melanjutkan.
              </p>
              <div className="bg-orange-100 p-4 rounded-lg text-left">
                <p className="font-semibold">Langkah Selanjutnya:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-gray-600">
                  <li>Buka file <code className="bg-orange-200 text-orange-800 p-1 rounded font-mono text-xs">services/supabase.ts</code> di editor Anda.</li>
                  <li>Ganti placeholder <code className="bg-orange-200 text-orange-800 p-1 rounded font-mono text-xs">'YOUR_SUPABASE_URL'</code> dan <code className="bg-orange-200 text-orange-800 p-1 rounded font-mono text-xs">'YOUR_SUPABASE_ANON_KEY'</code> dengan kredensial dari dasbor proyek Supabase Anda.</li>
                </ol>
              </div>
               <p className="mt-6 text-sm text-gray-500">
                Setelah menyimpan perubahan, segarkan kembali halaman ini.
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