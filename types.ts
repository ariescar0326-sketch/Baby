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

export type TopicTag = '健康' | '心理' | '安全' | '營養' | '發展' | '外觀' | '價值觀';

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
  mohwFacts: string;     
  mohwTitle?: string;     // Specific Title for search fallback
  journalResearch: string; 
  journalTitle?: string;  // Specific Paper Title
}

export interface HistoryItem {
  stageId: StageId;
  topicId: string;
  data: AdviceResult;
}