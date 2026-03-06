/// <reference types="vite/client" />

import React, { useState, useEffect, useRef } from 'react';
import type { Part, Message } from '../../types';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { SparkleIcon } from '../icons/SparkleIcon';
import { XIcon } from '../icons/XIcon';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  initialPrompt?: string;
  isLoggedIn: boolean;
  userAvatarId: string;
}

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64encodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64encodedData,
      mimeType: file.type,
    },
  };
};

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, onOpen, initialPrompt, isLoggedIn, userAvatarId }) => {
  const [messages, setMessages] = useState<Message[]>([
      {
          role: 'model',
          parts: [{ text: "Halo! Saya GeGed. Silakan masuk untuk mulai berinteraksi!" }]
      }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && isOpen && isLoggedIn) {
        handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen, isLoggedIn]);

  const handleSendMessage = async (inputText: string, imageFile?: File) => {
    if ((!inputText.trim() && !imageFile) || isLoading || !isLoggedIn) return;
    
    setIsLoading(true);
    
    const userParts: Part[] = [];
    if (inputText.trim()) userParts.push({ text: inputText });
    
    if (imageFile) {
        try {
            const imagePart = await fileToGenerativePart(imageFile);
            userParts.push(imagePart);
        } catch (error) {
            console.error("Error processing file:", error);
            setIsLoading(false);
            return;
        }
    }

    const newUserMessage: Message = { role: 'user', parts: userParts };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    try {
        // PERBAIKAN: Gunakan API Key yang bersih tanpa spasi
        const apiKey = "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";
        
        const history = updatedMessages.slice(1);
        const mappedMessages = history.map(msg => {
            let content: any = "";
            const hasImage = msg.parts.some(p => 'inlineData' in p);
            
            if (hasImage) {
                content = msg.parts.map(p => {
                    if ('text' in p) return { type: "text", text: p.text };
                    if ('inlineData' in p) return { 
                        type: "image_url", 
                        image_url: { url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` } 
                    };
                    return null;
                }).filter(Boolean);
            } else {
                content = msg.parts.map(p => 'text' in p ? p.text : '').join('\n');
            }

            return {
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: content
            };
        });

        const systemPrompt = {
            role: "system",
            content: "Anda adalah asisten yang selalu merespons dalam Bahasa Indonesia."
        };

        // PERBAIKAN: Hapus properti 'user' untuk menghindari error 401/400
        const requestBody = {
            model: "nvidia/nemotron-3-nano-30b-a3b:free",
            messages: [systemPrompt, ...mappedMessages],
            stream: true
        };

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "GeGed App",
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Error ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Gagal membaca respon AI");
        
        const decoder = new TextDecoder();
        let fullResponse = "";

        // Tambahkan placeholder model response
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: "" }] }]);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6);
                    if (dataStr === '[DONE]') continue;
                    try {
                        const json = JSON.parse(dataStr);
                        const content = json.choices[0]?.delta?.content;
                        if (content) {
                            fullResponse += content;
                            setMessages(prev => {
                                const newMsgs = [...prev];
                                newMsgs[newMsgs.length - 1].parts = [{ text: fullResponse }];
                                return newMsgs;
                            });
                        }
                    } catch (e) { /* ignore chunk error */ }
                }
            }
        }
    } catch (error: any) {
        console.error("AI Chat Error:", error);
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: `Maaf, terjadi kesalahan: ${error.message}` }] }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={onOpen}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <SparkleIcon className="w-8 h-8" />
      </button>

      <div className={`fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between p-4 border-b bg-emerald-50 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <SparkleIcon className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-800">GeGed</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <ChatBubble key={index} message={msg} userAvatarId={userAvatarId}/>
            ))}
            {isLoading && <div className="text-xs italic text-gray-400">GeGed sedang berpikir...</div>}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading || !isLoggedIn} />
          {!isLoggedIn && <p className="text-xs text-center text-gray-500 mt-2">Silakan login terlebih dahulu.</p>}
        </div>
      </div>
    </>
  );
};

export default AIChat;