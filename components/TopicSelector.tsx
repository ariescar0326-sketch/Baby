import React, { useState, useEffect } from 'react';
import { Stage, Topic, TopicTag } from '../types';

interface TopicSelectorProps {
  stage: Stage;
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void; 
}

const TagBadge: React.FC<{ tag: TopicTag | string }> = ({ tag }) => {
  // Muted, earthy/pastel colors for tags
  const colors: Record<string, string> = {
    '健康': 'bg-[#A3D5DC] text-slate-700', // Teal
    '心理': 'bg-[#E3D5C9] text-slate-700', // Beige
    '營養': 'bg-orange-100 text-orange-700',
    '發展': 'bg-blue-100 text-blue-700',
    '價值觀': 'bg-[#F3EFDD] text-slate-700', // Cream
    '商品': 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${colors[tag as string] || 'bg-slate-100 text-slate-500'}`}>
      {tag}
    </span>
  );
};

const TopicSelector: React.FC<TopicSelectorProps> = ({ stage, onSelectTopic }) => {
  const [readTopics, setReadTopics] = useState<string[]>([]);
  const [filterHealth, setFilterHealth] = useState(false);
  const [displayCount, setDisplayCount] = useState(8); 

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

  const filteredTopics = filterHealth 
    ? stage.topics.filter(t => t.tag === '健康')
    : stage.topics;

  const visibleTopics = filteredTopics.slice(0, displayCount);
  const hasMore = visibleTopics.length < filteredTopics.length;

  return (
    <div className="w-full bg-[#E3E8EB] min-h-[calc(100vh-60px)]">
      
      {/* Sticky Header with Key Focus - Adjusted top-0 to account for possible parent constraints or just standard sticky */}
      {/* Since the main app header is 14 (3.5rem) high and sticky, this needs to stick below it? 
          Actually, the main header is sticky, so this one sticking to top-14 (3.5rem) ensures it sits under it. */}
      <div className="sticky top-14 z-20 bg-[#E3E8EB]/95 backdrop-blur-sm px-5 py-4 border-b border-[#A3D5DC]/30 shadow-sm relative transition-all">
        <div className="max-w-sm mx-auto flex items-start gap-3 pr-12">
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

        {/* Round Green Filter Button with "健" */}
        <div className="absolute top-4 right-4 md:right-[calc(50%-180px)]">
            <button
            onClick={() => setFilterHealth(!filterHealth)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2
                ${filterHealth 
                ? 'bg-[#A3D5DC] border-[#A3D5DC] text-white shadow-inner scale-95' 
                : 'bg-white border-[#A3D5DC] text-[#7ca9b0] shadow-md hover:scale-105'
                }`}
            aria-label="只看健康"
            >
            <span className="font-bold text-sm">健</span>
            </button>
        </div>
      </div>

      {/* List Area */}
      <div className="px-4 pb-20 pt-4 space-y-3">
        {visibleTopics.map((topic, index) => {
          const isRead = readTopics.includes(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              // Default #E3E8EB (blending) with border. Active/Hover #F3EFDD.
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
        
        {filteredTopics.length === 0 && (
           <div className="text-center py-10 text-slate-400">
              沒有相關的健康話題
           </div>
        )}

        {/* Load More Trigger */}
        {hasMore && (
             <button 
                onClick={() => setDisplayCount(prev => prev + 5)}
                className="block mx-auto mt-6 px-6 py-2 rounded-full bg-white text-slate-500 text-sm font-medium shadow-sm hover:bg-slate-50 border border-slate-200 transition-all"
             >
                載入更多問題...
             </button>
        )}

        {!hasMore && filteredTopics.length > 0 && (
            <div className="text-center py-8 text-slate-400 text-sm flex flex-col items-center opacity-50">
                <span className="text-xs mb-2">沒有更多了</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full mb-1"></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TopicSelector;