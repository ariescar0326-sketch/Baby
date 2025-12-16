import React, { useState, useEffect } from 'react';
import { Stage, Topic, TopicTag } from '../types';

interface TopicSelectorProps {
  stage: Stage;
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void; 
}

const TagBadge: React.FC<{ tag: TopicTag | string }> = ({ tag }) => {
  const colors: Record<string, string> = {
    '健康': 'bg-teal-50 text-teal-600',
    '心理': 'bg-purple-50 text-purple-600',
    '安全': 'bg-rose-50 text-rose-600',
    '營養': 'bg-orange-50 text-orange-600',
    '發展': 'bg-blue-50 text-blue-600',
    '外觀': 'bg-gray-50 text-gray-600',
    '價值觀': 'bg-amber-50 text-amber-600',
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border border-transparent ${colors[tag as string] || 'bg-slate-50 text-slate-500'}`}>
      {tag}
    </span>
  );
};

const TopicSelector: React.FC<TopicSelectorProps> = ({ stage, onSelectTopic }) => {
  const [readTopics, setReadTopics] = useState<string[]>([]);
  const [filterHealth, setFilterHealth] = useState(false);

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

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-60px)]">
      
      {/* Header with Key Focus and Filter Button */}
      <div className="bg-white px-5 py-6 border-b border-slate-200 shadow-sm mb-4 relative">
        <div className="flex items-start gap-3 pr-12">
          <span className="text-3xl filter grayscale opacity-80">{stage.icon}</span>
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              這個階段最重要
            </div>
            <h2 className="text-lg font-bold text-slate-800 leading-snug">
              {stage.keyFocus}
            </h2>
          </div>
        </div>

        {/* Round Green Filter Button with "健" */}
        <button
          onClick={() => setFilterHealth(!filterHealth)}
          className={`absolute top-6 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2
            ${filterHealth 
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-inner scale-95' 
              : 'bg-white border-emerald-500 text-emerald-600 shadow-md hover:scale-105'
            }`}
          aria-label="只看健康"
        >
          <span className="font-bold text-sm">健</span>
        </button>
      </div>

      {/* List */}
      <div className="px-4 pb-20 space-y-3">
        {filteredTopics.map((topic) => {
          const isRead = readTopics.includes(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              className={`w-full text-left p-4 rounded-xl border shadow-sm transition-all duration-200 flex items-start justify-between group
                ${isRead 
                  ? 'bg-slate-50 border-slate-100 opacity-70' 
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
            >
              <div className="flex-grow pr-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <TagBadge tag={topic.tag} />
                  {isRead && (
                    <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      已讀
                    </span>
                  )}
                </div>
                <h3 className={`text-base font-medium leading-normal ${isRead ? 'text-slate-500' : 'text-slate-800 group-hover:text-blue-700'}`}>
                  {topic.title}
                </h3>
              </div>
              <div className="mt-1 opacity-20 group-hover:opacity-60">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
          );
        })}
        
        {filteredTopics.length === 0 && (
           <div className="text-center py-10 text-slate-400">
              沒有相關的健康話題
           </div>
        )}

        <div className="text-center py-8 text-slate-400 text-sm flex flex-col items-center opacity-50">
          <div className="w-1 h-1 bg-slate-300 rounded-full mb-1"></div>
          <div className="w-1 h-1 bg-slate-300 rounded-full mb-1"></div>
          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelector;