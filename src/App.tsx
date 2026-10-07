/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import dictionaryData from './data.json';
import { TopBar } from './components/TopBar';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { FALLBACK_DATA } from './data/fallback';
import { RawPhrasalVerbEntry, GroupedPhrasalVerb } from './types';
import { groupPhrasalVerbs, PhrasalVerbSearchIndex } from './utils/search';

const QUICK_CHIPS = ['finish', 'delay', 'tolerate', 'eat', 'refuse'];

// Use directly imported data for instant HMR updates
const INITIAL_DATA: RawPhrasalVerbEntry[] =
  Array.isArray(dictionaryData) && dictionaryData.length > 0
    ? (dictionaryData as RawPhrasalVerbEntry[])
    : FALLBACK_DATA;

export default function App() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Dark Mode State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark class to documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Initial query from URL (?q=...)
  const [inputValue, setInputValue] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    }
    return '';
  });

  const [debouncedQuery, setDebouncedQuery] = useState<string>(inputValue);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Group phrasal verbs and build in-memory index from directly imported JSON
  const groupedData: GroupedPhrasalVerb[] = useMemo(() => {
    return groupPhrasalVerbs(INITIAL_DATA);
  }, []);

  const searchIndex = useMemo(() => {
    return new PhrasalVerbSearchIndex(groupedData);
  }, [groupedData]);

  // Debounce query (50ms) and sync URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
      setActiveIndex(-1);

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        const trimmed = inputValue.trim();
        if (trimmed) {
          url.searchParams.set('q', trimmed);
        } else {
          url.searchParams.delete('q');
        }
        window.history.replaceState({}, '', url.toString());
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Results
  const results = useMemo(() => {
    return searchIndex.search(debouncedQuery);
  }, [searchIndex, debouncedQuery]);

  // Keyboard shortcuts: / to focus, Esc to clear
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }

      if (e.key === 'Escape') {
        setInputValue('');
        setDebouncedQuery('');
        setActiveIndex(-1);
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Keyboard navigation through results
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = activeIndex < results.length - 1 ? activeIndex + 1 : 0;
      setActiveIndex(nextIndex);
      cardRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = activeIndex > 0 ? activeIndex - 1 : results.length - 1;
      setActiveIndex(prevIndex);
      cardRefs.current[prevIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < results.length) {
        const item = results[activeIndex].entry;
        navigator.clipboard.writeText(item.phrasal_verb);
      }
    }
  };

  const handleChipClick = useCallback((word: string) => {
    setInputValue(word);
    setDebouncedQuery(word);
    setActiveIndex(-1);
    inputRef.current?.focus();

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('q', word.trim());
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleClear = () => {
    setInputValue('');
    setDebouncedQuery('');
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] flex flex-col transition-colors">
      {/* 1. Top Bar */}
      <TopBar isDark={isDark} onToggleTheme={() => setIsDark((prev) => !prev)} />

      {/* 2. Main Container (Dual Panel Layout) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col justify-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Panel: Input */}
          <InputPanel
            value={inputValue}
            onChange={setInputValue}
            onClear={handleClear}
            onKeyDown={handleKeyDown}
            onChipClick={handleChipClick}
            quickChips={QUICK_CHIPS}
            inputRef={inputRef}
          />

          {/* Right Panel: Output / Results */}
          <OutputPanel
            query={debouncedQuery}
            results={results}
            onKeywordClick={handleChipClick}
            activeIndex={activeIndex}
            cardRefs={cardRefs}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Reverse Phrasal Verb Dictionary • Instant & Bidirectional</span>
          <div className="flex items-center gap-3">
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-sans text-[11px]">/</kbd> to search
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-sans text-[11px]">Esc</kbd> to clear
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
