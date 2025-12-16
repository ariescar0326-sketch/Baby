export enum StageId {
  PRE_PREG = 'pre_pregnancy',
  PREG_EARLY = 'pregnancy_early',
  PREG_MID = 'pregnancy_mid',
  PREG_LATE = 'pregnancy_late',
  NEWBORN_BIRTH = 'newborn_birth', // 0-1m
  NEWBORN_ROUTINE = 'newborn_routine', // 1-4m
  INFANT_FLIP = 'infant_flip', // 4-6m
  INFANT_CRAWL = 'infant_crawl', // 7-12m
  TODDLER_WALK = 'toddler_walk', // 1y-1.5y
  TODDLER_TALK = 'toddler_talk' // 1.5y-3y
}

export type TopicTag = '檢查' | '健康' | '衛教' | '心理' | '營養' | '發展' | '價值觀' | '商品' | '教育';

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
  keyFocus: string; 
  icon: string;
  topics: Topic[];
}

export interface AdviceResult {
  socialQuotes: string[]; 
  mohwFacts: string;     
  journalResearch: string; 
}

export interface HistoryItem {
  stageId: StageId;
  topicId: string;
  data: AdviceResult;
}