export interface PhrasalVerbSense {
  sense: string;
  keywords: string[];
  register?: string;
  separable: boolean;
  separable_pattern?: string;
  example: string;
}

export interface RawPhrasalVerbEntry {
  phrasal_verb: string;
  sense: string;
  keywords: string[];
  register?: string;
  separable: boolean;
  separable_pattern?: string;
  example: string;
}

export interface GroupedPhrasalVerb {
  phrasal_verb: string;
  senses: PhrasalVerbSense[];
  allKeywords: string[];
}

export interface SearchMatchResult {
  entry: GroupedPhrasalVerb;
  matchedSenseIndices: number[];
  rankScore: number; // lower is better ranking
}
