
import React from 'react';
import type { Message } from '../../types';
import { SparkleIcon } from '../icons/SparkleIcon';
import { renderAvatar } from '../AvatarSelector';

interface ChatBubbleProps {
  message: Message;
  userAvatarId: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, userAvatarId }) => {
  const isUser = message.role === 'user';
  const bubbleClasses = isUser
    ? 'bg-emerald-600 text-white rounded-br-none'
    : 'bg-gray-100 text-gray-800 rounded-bl-none';
  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  const avatar = isUser
    ? renderAvatar(userAvatarId, 'w-8 h-8 rounded-full flex-shrink-0')
    : <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"><SparkleIcon className="w-5 h-5 text-emerald-600"/></div>;

  return (
    <div className={`flex items-start gap-3 ${containerClasses}`}>
      {!isUser && avatar}
      <div className={`p-3 rounded-lg max-w-[85%] ${bubbleClasses} flex flex-col space-y-2`}>
        {message.parts.map((part, index) => {
          if ('text' in part && part.text) {
            // Basic markdown for bold and italics
            const formatText = (text: string) => {
                return text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
            };
            return <div key={index} className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatText(part.text) }} />;
          }
          if ('inlineData' in part && part.inlineData) {
            return (
              <img
                key={index}
                src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`}
                alt="Uploaded content"
                className="rounded-lg max-w-full h-auto"
              />
            );
          }
          return null;
        })}
      </div>
      {isUser && avatar}
    </div>
  );
};
