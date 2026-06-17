import React from 'react';
import { useChatbotStore } from '../store/chatbotStore';
import { RAG_MODELS } from '../data/ragModels';
import * as Icons from 'lucide-react';

export default function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatbotStore();

  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Active RAG Engine
        </h3>
        <p className="text-[11px] text-text-secondary/80">
          Switch models to query different database vectors.
        </p>
      </div>

      <div className="space-y-2">
        {RAG_MODELS.map((model) => {
          const IconComponent = Icons[model.icon] || Icons.HelpCircle;
          const isSelected = selectedModel === model.id;

          return (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start space-x-3 group relative overflow-hidden ${
                isSelected
                  ? 'border-primary-purple bg-light-purple/40 ring-1 ring-primary-purple shadow-sm'
                  : 'border-gray-200 hover:border-secondary-purple hover:bg-gray-50/50 bg-white/60'
              }`}
            >
              <div
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary-purple text-white border-primary-purple'
                    : 'bg-gray-50 text-text-secondary border-gray-100 group-hover:border-secondary-purple/20 group-hover:bg-light-purple/20'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm leading-none ${isSelected ? 'text-primary-purple' : 'text-text-primary'}`}>
                    {model.name}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected ? 'bg-primary-purple/10 text-primary-purple' : 'bg-gray-100 text-text-secondary'
                  }`}>
                    {model.engine}
                  </span>
                </div>
                <p className={`text-xs mt-1 leading-snug line-clamp-2 transition-colors ${
                  isSelected ? 'text-primary-purple/80' : 'text-text-secondary'
                }`}>
                  {model.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
