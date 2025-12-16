export enum StageId {
  PRE_PREG = 'pre_pregnancy',
  PREG_EARLY = 'pregnancy_early',
  PREG_MID = 'pregnancy_mid',
  PREG_LATE = 'pregnancy_late',
  NEWBORN_BIRTH = 'newborn_birth', // 0-1m
  NEWBORN_ROUTINE = 'newborn_routine', // 1-4m
  INFANT = 'infant',
  TODDLER = 'toddler'
}

// Merged: Safety->Health, Appearance->Development. Renamed: Utility->Merchandise(商品)
export type TopicTag = '健康' | '心理' | '營養' | '發展' | '價值觀' | '商品';

export interface Topic {
  id: string;
  title: string;
  tag: TopicTag;
  queryPrompt: string;
}

export interface Stage {
  id: StageId;
  label: string;
  subLabel?: string;
  description: string;
  keyFocus: string; // The "Most Important Thing"
  icon: string;
  topics: Topic[];
}

export interface AdviceResult {
  socialBuzz: string;
  socialQuotes: string[]; // Direct quotes from netizens
  socialUrl?: string;     // Link to a thread
  mohwFacts: string;     
  mohwTitle?: string;
  mohwUrl?: string;       // Direct link
  journalResearch: string; 
  journalTitle?: string;
  journalUrl?: string;    // Direct link
}

export interface HistoryItem {
  stageId: StageId;
  topicId: string;
  data: AdviceResult;
}