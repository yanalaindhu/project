import React from 'react';
import { useChatbotStore } from '../store/chatbotStore';
import { Database, CheckCircle2 } from 'lucide-react';

export default function DatabasePanel() {
  const { activeDatabases } = useChatbotStore();

  return (
    <div className="space-y-3 pt-4 border-t border-gray-100">
      <div className="flex items-center space-x-2">
        <Database className="w-3.5 h-3.5 text-text-secondary" />
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Active Vector Stores
        </span>
      </div>

      <div className="space-y-1.5">
        {activeDatabases.map((db, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/50 border border-gray-100 text-xs shadow-inner"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-success-green flex-shrink-0" />
              <span className="font-semibold text-text-primary truncate">{db.name}</span>
            </div>
            <span className="text-[10px] font-bold text-text-secondary bg-gray-100 border border-gray-200/50 px-1.5 py-0.5 rounded-md flex-shrink-0 ml-2">
              {db.documentsCount} docs
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
