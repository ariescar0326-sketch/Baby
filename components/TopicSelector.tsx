import React, { useState, useEffect } from 'react';
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
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${colors[tag as string] || 'bg-slate-100 text-slate-500'}`}>
      {tag}
    </span>
  );
};

const TopicSelector: React.FC<TopicSelectorProps> = ({ stage, onSelectTopic }) => {
  const [readTopics, setReadTopics] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState(false); // Green Man Filter
  const [displayTopics, setDisplayTopics] = useState<Topic[]>(stage.topics);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayCount, setDisplayCount] = useState(8); 

  // Reset topics when stage changes
  useEffect(() => {
    setDisplayTopics(stage.topics);
    setDisplayCount(8);
  }, [stage]);

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

  const handleRefreshTrends = async () => {
    setIsRefreshing(true);
    try {
      const trendingTopics = await fetchTrendingTopics(stage.label);
      if (trendingTopics && trendingTopics.length > 0) {
        setDisplayTopics(trendingTopics);
        setDisplayCount(trendingTopics.length); // Show all new topics
      }
    } catch (error) {
      console.error("Failed to refresh topics", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter Logic: Green Man = Checkup (檢查) + Health (健康) + Health Edu (衛教)
  const filteredTopics = filterMode 
    ? displayTopics.filter(t => t.tag === '檢查' || t.tag === '健康' || t.tag === '衛教')
    : displayTopics;

  const visibleTopics = filteredTopics.slice(0, displayCount);
  const hasMore = visibleTopics.length < filteredTopics.length;

  return (
    <div className="w-full bg-[#E3E8EB] min-h-[calc(100vh-60px)]">
      
      {/* Sticky Header */}
      <div className="sticky top-14 z-20 bg-[#E3E8EB]/95 backdrop-blur-sm px-5 py-4 border-b border-[#A3D5DC]/30 shadow-sm relative transition-all">
        <div className="max-w-sm mx-auto flex items-start gap-3 pr-24">
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

        <div className="absolute top-4 right-4 flex gap-2">
            {/* Refresh Button */}
            <button
              onClick={handleRefreshTrends}
              disabled={isRefreshing}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2 bg-white border-[#E3D5C9] text-slate-600 shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100`}
              aria-label="刷新話題"
            >
              {isRefreshing ? (
                 <svg className="animate-spin h-5 w-5 text-[#A3D5DC]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                <span className="text-lg">✨</span>
              )}
            </button>

            {/* Filter Button (Green Person - Full Body) */}
            <button
                onClick={() => setFilterMode(!filterMode)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2
                    ${filterMode 
                    ? 'bg-[#A3D5DC] border-[#A3D5DC] text-white shadow-inner scale-95' 
                    : 'bg-white border-[#A3D5DC] text-[#7ca9b0] shadow-md hover:scale-105'
                    }`}
                aria-label="只看健康/檢查/衛教"
            >
                {/* Full Body Person Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.6569 2 15 3.34315 15 5C15 6.65685 13.6569 8 12 8C10.3431 8 9 6.65685 9 5C9 3.34315 10.3431 2 12 2Z" />
                  <path d="M14 10V14H16.5C17.3284 14 18 14.6716 18 15.5V19.5C18 20.3284 17.3284 21 16.5 21H14.5C14.2239 21 14 20.7761 14 20.5V18H10V20.5C10 20.7761 9.77614 21 9.5 21H7.5C6.67157 21 6 20.3284 6 19.5V15.5C6 14.6716 6.67157 14 7.5 14H10V10H14Z" />
                </svg>
            </button>
        </div>
      </div>

      {/* List Area */}
      <div className="px-4 pb-20 pt-4 space-y-3">
        {isRefreshing && (
          <div className="text-center py-8 animate-pulse text-slate-500 text-sm">
             🔍 正在搜尋論壇最新熱門話題...
          </div>
        )}

        {!isRefreshing && visibleTopics.map((topic, index) => {
          const isRead = readTopics.includes(topic.id);
          return (
            <button
              key={topic.id}
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
        
        {!isRefreshing && filteredTopics.length === 0 && (
           <div className="text-center py-10 text-slate-400">
              沒有相關話題
           </div>
        )}

        {/* Load More Trigger */}
        {!isRefreshing && hasMore && (
             <button 
                onClick={() => setDisplayCount(prev => prev + 5)}
                className="block mx-auto mt-6 px-6 py-2 rounded-full bg-white text-slate-500 text-sm font-medium shadow-sm hover:bg-slate-50 border border-slate-200 transition-all"
             >
                載入更多問題...
             </button>
        )}

        {!isRefreshing && !hasMore && filteredTopics.length > 0 && (
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