import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start items-end space-x-2 p-4 animate-fadeIn">
      {/* Robot Profile Icon Placeholder */}
      <div className="w-8 h-8 rounded-xl bg-light-purple border border-primary-purple/15 text-primary-purple flex items-center justify-center font-bold text-xs shadow-inner select-none flex-shrink-0">
        AI
      </div>

      {/* Bubble Container */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1.5 min-w-[60px] justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-purple/70 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary-purple/70 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary-purple/70 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
