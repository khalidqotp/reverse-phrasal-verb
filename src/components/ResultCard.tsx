import React, { useState } from 'react';
import { Copy, Check, CornerDownRight } from 'lucide-react';
import { GroupedPhrasalVerb } from '../types';

interface ResultCardProps {
  item: GroupedPhrasalVerb;
  isActive: boolean;
  onKeywordClick: (keyword: string) => void;
  cardRef?: (el: HTMLDivElement | null) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  item,
  isActive,
  onKeywordClick,
  cardRef,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.phrasal_verb);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = item.phrasal_verb;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      className={`relative bg-white dark:bg-[#1E293B] border rounded-xl p-4 sm:p-5 transition-all duration-150 outline-none shadow-2xs ${
        isActive
          ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20'
          : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {/* Card Header: Phrasal Verb (bold blue/accent) & Copy button */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-3.5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 leading-snug">
            {item.phrasal_verb}
          </h3>
          {item.senses.length > 1 && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {item.senses.length} senses
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
            copied
              ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
          }`}
          title="Copy phrasal verb"
          aria-label={`Copy ${item.phrasal_verb}`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Senses Grouping */}
      <div className="space-y-4">
        {item.senses.map((senseItem, idx) => (
          <div
            key={idx}
            className={`${
              item.senses.length > 1 && idx > 0
                ? 'pt-3.5 border-t border-slate-100 dark:border-slate-700/60'
                : ''
            }`}
          >
            {/* Meaning & Separable Badge */}
            <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
              {item.senses.length > 1 && (
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {idx + 1}.
                </span>
              )}

              <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-normal">
                {senseItem.sense}
              </p>

              {/* Separable Badge */}
              {senseItem.separable && (
                <span className="inline-flex items-center text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800/80 px-2 py-0.5 rounded-full">
                  {senseItem.separable_pattern || 'separable'}
                </span>
              )}

              {/* Register Badge */}
              {senseItem.register && senseItem.register !== 'neutral' && (
                <span className="inline-flex items-center text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {senseItem.register}
                </span>
              )}
            </div>

            {/* Example sentence */}
            {senseItem.example && (
              <div className="my-2 pl-3 border-l-2 border-blue-300 dark:border-blue-600 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed italic">
                <HighlightExample
                  example={senseItem.example}
                  phrasalVerb={item.phrasal_verb}
                />
              </div>
            )}

            {/* Synonyms as soft chips */}
            {senseItem.keywords && senseItem.keywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 flex items-center gap-0.5 mr-0.5">
                  <CornerDownRight className="w-2.5 h-2.5" />
                  synonyms:
                </span>
                {senseItem.keywords.map((kw, kIdx) => (
                  <button
                    key={kIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onKeywordClick(kw);
                    }}
                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border-0 cursor-pointer transition-colors"
                    title={`Search "${kw}"`}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface HighlightExampleProps {
  example: string;
  phrasalVerb: string;
}

const HighlightExample: React.FC<HighlightExampleProps> = ({ example, phrasalVerb }) => {
  const parts = phrasalVerb.trim().split(/\s+/);
  
  if (parts.length === 0) {
    return <span>{example}</span>;
  }

  const verbStem = parts[0].replace(/e$/, '');
  const particles = parts.slice(1).map(p => escapeRegExp(p)).join('\\s+');
  const verbPattern = `${escapeRegExp(verbStem)}(?:[a-z]{0,4})?`;
  
  const combinedRegex = new RegExp(
    `\\b(${verbPattern}(?:\\s+[a-z0-9'-]{1,15})?\\s+${particles}|${escapeRegExp(phrasalVerb)})\\b`,
    'gi'
  );

  const matched = combinedRegex.exec(example);

  if (!matched) {
    const simpleRegex = new RegExp(`(${escapeRegExp(phrasalVerb)})`, 'gi');
    const segments = example.split(simpleRegex);
    return (
      <span>
        {segments.map((seg, i) =>
          seg.toLowerCase() === phrasalVerb.toLowerCase() ? (
            <span
              key={i}
              className="font-semibold not-italic bg-blue-50 dark:bg-blue-950/90 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded"
            >
              {seg}
            </span>
          ) : (
            seg
          )
        )}
      </span>
    );
  }

  const segments = example.split(combinedRegex);

  return (
    <span>
      {segments.map((seg, i) => {
        if (
          seg.toLowerCase().includes(parts[0].toLowerCase()) &&
          seg.toLowerCase().includes(parts[parts.length - 1].toLowerCase())
        ) {
          return (
            <span
              key={i}
              className="font-semibold not-italic bg-blue-50 dark:bg-blue-950/90 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded"
            >
              {seg}
            </span>
          );
        }
        return seg;
      })}
    </span>
  );
};

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
