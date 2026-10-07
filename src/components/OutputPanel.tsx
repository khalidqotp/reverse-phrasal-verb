import React from 'react';
import { SearchMatchResult } from '../types';
import { ResultCard } from './ResultCard';
import { BookOpen } from 'lucide-react';

interface OutputPanelProps {
  query: string;
  results: SearchMatchResult[];
  onKeywordClick: (keyword: string) => void;
  activeIndex: number;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  query,
  results,
  onKeywordClick,
  activeIndex,
  cardRefs,
}) => {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="w-full h-[520px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Phrasal Verbs
            </span>
          </div>
          {hasQuery && (
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-800/80 px-2.5 py-0.5 rounded-full">
              {results.length} {results.length === 1 ? 'match' : 'matches'}
            </span>
          )}
        </div>

        {/* Scrollable Results Area / Empty State */}
        {!hasQuery ? (
          // Empty State: Prompt centered in available vertical space
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-2xs">
              <BookOpen className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Matching phrasal verbs will appear here
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Type an everyday word like <span className="font-semibold text-slate-700 dark:text-slate-300">"eat"</span>, <span className="font-semibold text-slate-700 dark:text-slate-300">"finish"</span>, or <span className="font-semibold text-slate-700 dark:text-slate-300">"tolerate"</span> on the left.
            </p>
          </div>
        ) : results.length > 0 ? (
          // Results list with custom thin scrollbar and right-padding to avoid overlap
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2.5 space-y-3.5">
            {results.map((result, idx) => (
              <ResultCard
                key={result.entry.phrasal_verb}
                item={result.entry}
                isActive={idx === activeIndex}
                onKeywordClick={onKeywordClick}
                cardRef={(el) => {
                  cardRefs.current[idx] = el;
                }}
              />
            ))}
          </div>
        ) : (
          // No results found
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              No phrasal verbs found for "{query}"
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Try searching a simple verb or synonym like "finish", "delay", "eat", or "quit".
            </p>
          </div>
        )}
      </div>

      {hasQuery && results.length > 0 && (
        <div className="pt-3 mt-3 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 text-right shrink-0">
          Use ↑ ↓ to navigate results
        </div>
      )}
    </div>
  );
};
