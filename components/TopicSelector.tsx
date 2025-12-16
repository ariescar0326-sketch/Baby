import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Topic, TopicTag } from '../types';
import { fetchTrendingTopics } from '../services/geminiService';

interface TopicSelectorProps {
  stage: Stage;
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void; 
}

const TagBadge: React.FC<{ tag: TopicTag | string }> = ({ tag }) => {
  const colors: Record<string, string> = {
    '檢查': 'bg-rose-100 text-rose-700',
    '健康': 'bg-[#A3D5DC] text-slate-700', // Teal
    '衛教': 'bg-cyan-100 text-cyan-700',   // Cyan for Edu
    '心理': 'bg-[#E3D5C9] text-slate-700', // Beige
    '營養': 'bg-orange-100 text-orange-700',
    '發展': 'bg-blue-100 text-blue-700',
    '價值觀': 'bg-[#F3EFDD] text-slate-700', // Cream
    '商品': 'bg-emerald-100 text-emerald-700',
    '教育': 'bg-indigo-100 text-indigo-700',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${colors[tag as string] || 'bg-slate-100 text-slate-500'}`}>
      {tag}
    </span>
  );
};

const TopicSelector: React.FC<TopicSelectorProps> = ({ stage, onSelectTopic }) => {
  const [readTopics, setReadTopics] = useState<string[]>([]);
  const [displayTopics, setDisplayTopics] = useState<Topic[]>(stage.topics);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset topics when stage changes
  useEffect(() => {
    setDisplayTopics(stage.topics);
  }, [stage]);

  // Load read status
  useEffect(() => {
    const saved = localStorage.getItem('scienceDad_readTopics');
    if (saved) {
      setReadTopics(JSON.parse(saved));
    }
  }, []);

  const handleTopicClick = (topic: Topic) => {
    const newRead = [...readTopics, topic.id];
    const uniqueRead = Array.from(new Set(newRead));
    setReadTopics(uniqueRead);
    localStorage.setItem('scienceDad_readTopics', JSON.stringify(uniqueRead));
    onSelectTopic(topic);
  };

  const loadMoreTopics = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    
    try {
      // Pass existing titles to avoid duplicates
      const existingTitles = displayTopics.map(t => t.title);
      const newTopics = await fetchTrendingTopics(stage.label, existingTitles);
      
      if (newTopics && newTopics.length > 0) {
        setDisplayTopics(prev => [...prev, ...newTopics]);
      }
    } catch (error) {
      console.error("Failed to load more topics", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, displayTopics, stage.label]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreTopics();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMoreTopics]);

  return (
    <div className="w-full bg-[#E3E8EB] min-h-[calc(100vh-60px)]">
      
      {/* Sticky Header - Simplified */}
      <div className="sticky top-14 z-20 bg-[#E3E8EB]/95 backdrop-blur-sm px-5 py-4 border-b border-[#A3D5DC]/30 shadow-sm relative transition-all">
        <div className="max-w-sm mx-auto flex items-start gap-3">
          <span className="text-3xl filter grayscale opacity-80">{stage.icon}</span>
          <div>
            <div className="text-xs font-bold text-[#7ca9b0] uppercase tracking-wider mb-1">
              這個階段最重要
            </div>
            <h2 className="text-lg font-bold text-slate-800 leading-snug">
              {stage.keyFocus}
            </h2>
          </div>
        </div>
      </div>

      {/* List Area */}
      <div className="px-4 pb-20 pt-4 space-y-3">
        
        {displayTopics.map((topic, index) => {
          const isRead = readTopics.includes(topic.id);
          return (
            <button
              key={`${topic.id}-${index}`}
              onClick={() => handleTopicClick(topic)}
              className={`w-full max-w-sm mx-auto text-left p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between group relative overflow-hidden
                ${isRead 
                  ? 'bg-[#E3E8EB] border-slate-300 opacity-60' 
                  : 'bg-[#E3E8EB] border-slate-300 hover:bg-[#F3EFDD] hover:border-[#E3D5C9] hover:scale-[1.02] hover:shadow-md'
                }`}
            >
              <div className="flex-grow pr-2 pl-1">
                <div className="flex items-center gap-2 mb-2">
                  <TagBadge tag={topic.tag} />
                  {isRead && (
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">
                      已讀
                    </span>
                  )}
                </div>
                <h3 className={`text-base font-bold leading-normal ${isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                  {topic.title}
                </h3>
              </div>
              <div className="mt-1 opacity-20 group-hover:opacity-60 text-[#A3D5DC]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
          );
        })}
        
        {/* Infinite Scroll Trigger / Loader */}
        <div ref={observerTarget} className="py-8 flex justify-center items-center">
            {isLoadingMore ? (
                 <div className="flex flex-col items-center text-slate-400 text-xs gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#A3D5DC]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>載入更多話題...</span>
                 </div>
            ) : (
                <div className="h-4"></div> // Spacer to ensure observer can hit
            )}
        </div>

      </div>
    </div>
  );
};

export default TopicSelector;