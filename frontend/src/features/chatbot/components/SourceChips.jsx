import React from 'react';
import { FileText } from 'lucide-react';

export default function SourceChips({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="pt-2 border-t border-gray-100 mt-2 flex flex-col space-y-1 animate-fadeIn">
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
        Sources Retrieved:
      </span>
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {sources.map((src, idx) => (
          <div
            key={idx}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-light-purple/60 border border-primary-purple/10 text-primary-purple text-[10px] font-semibold"
          >
            <FileText className="w-2.5 h-2.5" />
            <span>{src}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
