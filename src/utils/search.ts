import { GroupedPhrasalVerb, RawPhrasalVerbEntry, SearchMatchResult } from '../types';

export function groupPhrasalVerbs(rawEntries: RawPhrasalVerbEntry[]): GroupedPhrasalVerb[] {
  const map = new Map<string, GroupedPhrasalVerb>();

  for (const item of rawEntries) {
    const key = item.phrasal_verb.trim().toLowerCase();
    const existing = map.get(key);

    const senseObj = {
      sense: item.sense,
      keywords: item.keywords || [],
      register: item.register,
      separable: item.separable,
      separable_pattern: item.separable_pattern || (item.separable ? `separable: ${formatSeparable(item.phrasal_verb)}` : undefined),
      example: item.example
    };

    if (existing) {
      existing.senses.push(senseObj);
      for (const kw of senseObj.keywords) {
        if (!existing.allKeywords.includes(kw.toLowerCase())) {
          existing.allKeywords.push(kw.toLowerCase());
        }
      }
    } else {
      map.set(key, {
        phrasal_verb: item.phrasal_verb,
        senses: [senseObj],
        allKeywords: (item.keywords || []).map(k => k.toLowerCase())
      });
    }
  }

  return Array.from(map.values());
}

function formatSeparable(phrasalVerb: string): string {
  const parts = phrasalVerb.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]} it ${parts.slice(1).join(' ')}`;
  }
  return `${phrasalVerb} (separable)`;
}

export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class PhrasalVerbSearchIndex {
  private items: GroupedPhrasalVerb[] = [];

  constructor(items: GroupedPhrasalVerb[]) {
    this.items = items;
  }

  public setItems(items: GroupedPhrasalVerb[]) {
    this.items = items;
  }

  public search(rawQuery: string): SearchMatchResult[] {
    const nq = rawQuery.trim().toLowerCase();
    if (!nq) {
      return [];
    }

    const escaped = escapeRegExp(nq);
    const wholeWordRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    const wordPrefixRegex = new RegExp(`\\b${escaped}`, 'i');

    const exactOrWholeWordResults = new Map<string, SearchMatchResult>();

    // Priority 1: Exact match in `keywords` or `phrasal_verb`
    for (const entry of this.items) {
      const verbLower = entry.phrasal_verb.toLowerCase();
      const isExactVerb = verbLower === nq;
      const matchedSenseIndices: number[] = [];

      let hasExactKeyword = false;
      entry.senses.forEach((s, idx) => {
        if (s.keywords.some(k => k.toLowerCase() === nq)) {
          hasExactKeyword = true;
          matchedSenseIndices.push(idx);
        }
      });

      if (isExactVerb || hasExactKeyword) {
        exactOrWholeWordResults.set(verbLower, {
          entry,
          matchedSenseIndices: isExactVerb ? entry.senses.map((_, i) => i) : matchedSenseIndices,
          rankScore: isExactVerb ? 1 : 2
        });
      }
    }

    // Priority 2: Whole-word match in `sense`
    for (const entry of this.items) {
      const verbLower = entry.phrasal_verb.toLowerCase();
      if (exactOrWholeWordResults.has(verbLower)) continue;

      const matchedSenseIndices: number[] = [];
      entry.senses.forEach((s, idx) => {
        if (wholeWordRegex.test(s.sense)) {
          matchedSenseIndices.push(idx);
        }
      });

      if (matchedSenseIndices.length > 0) {
        exactOrWholeWordResults.set(verbLower, {
          entry,
          matchedSenseIndices,
          rankScore: 10
        });
      }
    }

    // If we have exact or whole-word matches, DO NOT add prefix or unrelated matches
    if (exactOrWholeWordResults.size > 0) {
      return Array.from(exactOrWholeWordResults.values()).sort((a, b) => {
        if (a.rankScore !== b.rankScore) return a.rankScore - b.rankScore;
        return a.entry.phrasal_verb.localeCompare(b.entry.phrasal_verb);
      });
    }

    // Priority 3: Prefix match ONLY if no exact or whole-word match exists
    // (e.g. user is actively typing "fin", "dela", "tole", "refu")
    // Strictly at word boundaries - DO NOT match substrings inside larger unrelated words!
    const prefixResults = new Map<string, SearchMatchResult>();

    for (const entry of this.items) {
      const verbLower = entry.phrasal_verb.toLowerCase();
      const isPrefixVerb = verbLower.startsWith(nq) || wordPrefixRegex.test(verbLower);
      const matchedSenseIndices: number[] = [];

      let hasPrefixKeyword = false;
      entry.senses.forEach((s, idx) => {
        const kwPrefix = s.keywords.some(k => k.toLowerCase().startsWith(nq));
        const senseWordPrefix = wordPrefixRegex.test(s.sense);
        if (kwPrefix || senseWordPrefix) {
          hasPrefixKeyword = true;
          matchedSenseIndices.push(idx);
        }
      });

      if (isPrefixVerb || hasPrefixKeyword) {
        prefixResults.set(verbLower, {
          entry,
          matchedSenseIndices: isPrefixVerb && matchedSenseIndices.length === 0
            ? entry.senses.map((_, i) => i)
            : matchedSenseIndices,
          rankScore: isPrefixVerb ? 20 : 25
        });
      }
    }

    return Array.from(prefixResults.values()).sort((a, b) => {
      if (a.rankScore !== b.rankScore) return a.rankScore - b.rankScore;
      return a.entry.phrasal_verb.localeCompare(b.entry.phrasal_verb);
    });
  }
}
