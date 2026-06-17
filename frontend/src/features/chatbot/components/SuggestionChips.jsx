import React from 'react';
import { useChatbotStore } from '../store/chatbotStore';
import { MOCK_CHIPS } from '../data/mockConversations';
import { Sparkles } from 'lucide-react';

export default function SuggestionChips() {
  const { selectedModel, sendMessage, isTyping } = useChatbotStore();
  const chips = MOCK_CHIPS[selectedModel] || [];

  if (chips.length === 0 || isTyping) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2 animate-fadeIn justify-center md:justify-start">
      {chips.map((chip, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => sendMessage(chip.prompt)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-primary-purple/10 bg-light-purple/40 hover:bg-light-purple/80 hover:border-primary-purple text-primary-purple text-xs font-bold transition-all duration-150 cursor-pointer shadow-sm hover:shadow active:scale-95"
        >
          <Sparkles className="w-3 h-3 text-secondary-purple flex-shrink-0" />
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  );
}
