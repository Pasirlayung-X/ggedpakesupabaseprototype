// FIX: Add reference to vite client types to resolve error on import.meta.env
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
          parts: [{ text: "Halo! Saya GeGed. Anda bisa menyorot teks di halaman mana pun untuk bertanya secara kontekstual, atau mengirim foto untuk dianalisis. Silakan masuk untuk mulai berinteraksi!" }]
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

  // FIX: Refactored to use native fetch for OpenRouter API to avoid SDK validation issues in browser
  const handleSendMessage = async (inputText: string, imageFile?: File) => {
    if ((!inputText.trim() && !imageFile) || isLoading || !isLoggedIn) return;
    
    setIsLoading(true);
    
    // 1. Prepare user message for local state
    const userParts: Part[] = [];
    if (inputText.trim()) {
        userParts.push({ text: inputText });
    }
    if (imageFile) {
        try {
            const imagePart = await fileToGenerativePart(imageFile);
            userParts.push(imagePart);
        } catch (error) {
            console.error("Error processing file:", error);
            const errorMessage: Message = { role: 'model', parts: [{ text: `Maaf, terjadi kesalahan saat memproses gambar.` }] };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            return;
        }
    }
    const newUserMessage: Message = { role: 'user', parts: userParts };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    try {
        const apiKey = "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";
        
        // Filter out the initial greeting from the model to create the conversation history for the API call.
        const history = updatedMessages.slice(1);
        
        const mappedMessages = history.map(msg => {
            let content: any = "";
            if (msg.parts.length > 0) {
                // Check if there are any image parts
                const hasImage = msg.parts.some(p => 'inlineData' in p);
                if (hasImage) {
                    content = msg.parts.map(p => {
                        if ('text' in p) {
                            return { type: "text", text: p.text };
                        } else if ('inlineData' in p) {
                            return { 
                                type: "image_url", 
                                image_url: { 
                                    url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` 
                                } 
                            };
                        }
                        return null;
                    }).filter(Boolean);
                } else {
                    // Text only
                    content = msg.parts.map(p => 'text' in p ? p.text : '').join('\n');
                }
            }

            return {
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: content
            };
        });

        // Initialize empty model response
        const modelResponse: Message = { role: 'model', parts: [{ text: "" }] };
        setMessages(prev => [...prev, modelResponse]);

        const systemPrompt = {
            role: "system",
            content: "Anda adalah asisten yang selalu merespons dalam Bahasa Indonesia."
        };

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "GeGed App",
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-nano-30b-a3b:free",
                messages: [systemPrompt, ...mappedMessages],
                stream: true,
                user: userAvatarId // Add user ID to the request
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `OpenRouter API Error: ${response.statusText}`);
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line === 'data: [DONE]') continue;
                if (line.startsWith('data: ')) {
                    try {
                        const json = JSON.parse(line.substring(6));
                        const content = json.choices[0]?.delta?.content;
                        if (content) {
                            fullResponse += content;
                            setMessages(prev => {
                                const newMessages = [...prev];
                                const lastMessage = newMessages[newMessages.length - 1];
                                if (lastMessage.role === 'model') {
                                    lastMessage.parts = [{ text: fullResponse }];
                                }
                                return newMessages;
                            });
                        }
                    } catch (e) {
                        console.error("Error parsing stream chunk", e);
                    }
                }
            }
        }

    } catch (error: any) {
        console.error("AI Chat Error:", error);
        // Remove the empty model response if it exists and replace with error
        setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1].role === 'model' && newMessages[newMessages.length - 1].parts[0].text === "") {
                newMessages.pop();
            }
            return [...newMessages, { role: 'model', parts: [{ text: `Maaf, terjadi kesalahan: ${error.message}` }] }];
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={onOpen}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 ease-in-out hover:bg-emerald-700 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Buka Asisten AI"
      >
        <SparkleIcon className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-emerald-50 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <SparkleIcon className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-800">GeGed</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <ChatBubble key={index} message={msg} userAvatarId={userAvatarId}/>
            ))}
            {isLoading && messages[messages.length - 1].role !== 'model' && (
              <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-xs animate-pulse">
                      <span className="italic">AI sedang mengetik...</span>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading || !isLoggedIn} />
           {!isLoggedIn && (
              <p className="text-xs text-center text-gray-500 mt-2">
                Silakan <button onClick={onOpen} className="font-semibold text-emerald-600 hover:underline">masuk</button> untuk menggunakan asisten AI.
              </p>
            )}
        </div>
      </div>
    </>
  );
};

export default AIChat;