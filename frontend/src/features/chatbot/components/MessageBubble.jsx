import React from 'react';
import SourceChips from './SourceChips';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';

  // Function to format bold text and newlines
  const formatText = (text) => {
    return text.split('\n').map((paragraph, pIdx) => {
      // Split by double asterisks for bolding
      const parts = paragraph.split('**');
      const formattedLine = parts.map((part, idx) => {
        if (idx % 2 === 1) {
          return <strong key={idx} className="font-extrabold text-text-primary">{part}</strong>;
        }
        return part;
      });

      return (
        <p key={pIdx} className="mb-2 last:mb-0 text-sm leading-relaxed">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className={`flex items-end space-x-2 p-2 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      {/* 1. Left Robot Icon (only for assistant) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-light-purple border border-primary-purple/15 text-primary-purple flex items-center justify-center font-bold text-xs shadow-inner select-none flex-shrink-0">
          AI
        </div>
      )}

      {/* 2. Message Bubble */}
      <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm border ${
        isUser
          ? 'bg-primary-purple border-primary-purple text-white rounded-br-none'
          : 'bg-white border-gray-100 text-text-primary rounded-bl-none'
      }`}>
        {/* Message Text */}
        <div className={isUser ? 'text-white font-medium' : 'text-text-primary'}>
          {isUser ? <p className="text-sm leading-relaxed">{message.text}</p> : formatText(message.text)}
        </div>

        {/* Timestamp */}
        <div className={`text-[9px] mt-1.5 text-right font-medium tracking-wide ${
          isUser ? 'text-white/60' : 'text-text-secondary/60'
        }`}>
          {message.timestamp}
        </div>

        {/* Source Citation Section */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceChips sources={message.sources} />
        )}
      </div>

      {/* 3. Right User Icon (only for user) */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 text-text-secondary flex items-center justify-center font-bold text-xs shadow-inner select-none flex-shrink-0">
          ME
        </div>
      )}
    </div>
  );
}
