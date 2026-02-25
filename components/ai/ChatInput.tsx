
import React, { useState, useRef } from 'react';
import { PaperclipIcon } from '../icons/PaperclipIcon';

interface ChatInputProps {
  onSend: (text: string, file?: File) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!text.trim() && !file) || isLoading) return;
    onSend(text, file || undefined);
    setText('');
    setFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
          textarea.style.height = 'auto';
          const scrollHeight = textarea.scrollHeight;
          textarea.style.height = `${scrollHeight}px`;
      }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

  return (
    <div className="flex flex-col gap-2">
       {file && (
          <div className="relative p-2 bg-gray-100 rounded-lg">
            <img 
              src={URL.createObjectURL(file)}
              alt="Pratinjau"
              className="max-h-24 rounded-md"
            />
            <button
              onClick={() => {
                setFile(null);
                if(fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
            >
              &times;
            </button>
          </div>
        )}
        <div className="flex items-end gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500 transition-shadow">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                aria-label="Lampirkan gambar"
            >
                <PaperclipIcon className="w-5 h-5" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan Anda..."
                className="flex-1 bg-transparent border-none resize-none focus:ring-0 p-0 text-sm max-h-24"
                rows={1}
                disabled={isLoading}
            />
            <button
                onClick={handleSend}
                disabled={isLoading || (!text.trim() && !file)}
                className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
                Kirim
            </button>
        </div>
    </div>
  );
};
