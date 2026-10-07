import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

interface InputPanelProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onChipClick: (word: string) => void;
  quickChips: string[];
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  value,
  onChange,
  onClear,
  onKeyDown,
  onChipClick,
  quickChips,
  inputRef,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={handleContainerClick}
      className="w-full h-[260px] bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors cursor-text focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20"
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Panel Header: Google Translate style language/meaning tab */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Plain English / Meaning
            </span>
          </div>
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear input (Esc)"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Big Full-Height Textarea Area */}
        <div className="flex-1 w-full min-h-0 pt-1 flex flex-col">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
              onKeyDown?.(e);
            }}
            placeholder="Type a word or meaning (e.g. eat, finish, delay)..."
            className="flex-1 w-full h-full resize-none bg-transparent outline-none border-0 p-0 focus:outline-none focus:ring-0 text-xl sm:text-2xl font-normal text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed"
            autoFocus
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
      </div>

      {/* Panel Bottom: Quick Chips & Shortcuts hint */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Try:
            </span>
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChipClick(chip);
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  value.trim().toLowerCase() === chip.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/70 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans">/</kbd> to focus
          </div>
        </div>
      </div>
    </div>
  );
};
