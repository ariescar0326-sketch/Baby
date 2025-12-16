import React, { useEffect, useState } from 'react';
import { AdviceResult, Stage, Topic } from '../types';
import { fetchParentingAdvice } from '../services/geminiService';

const Spinner = () => (
  <svg className="animate-spin h-8 w-8 text-[#A3D5DC]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface AdviceViewProps {
  stage: Stage;
  topic: Topic;
  onBack: () => void;
}

const AdviceView: React.FC<AdviceViewProps> = ({ stage, topic, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AdviceResult | null>(null);

  const isValueTopic = topic.tag === '價值觀';

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchParentingAdvice(stage.label, topic.queryPrompt);
        if (isMounted) setResult(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [stage, topic]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 bg-[#E3E8EB] min-h-screen">
      
      {/* Title Section */}
      <div className="mb-6 mt-2 text-center">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
          {topic.title}
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Spinner />
          <p className="text-slate-500 animate-pulse text-sm">
            {isValueTopic ? '正在蒐集網路意見...' : '正在整理相關資料...'}
          </p>
        </div>
      ) : result ? (
        <div className="space-y-4 pb-20 max-w-lg mx-auto">
          
          {/* 1. Social Buzz (Quotes Only) - Changed to White background for consistency */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
             {/* Decorative blob kept but lighter */}
             <div className="absolute top-0 right-0 w-16 h-16 bg-[#E3D5C9] opacity-10 rounded-bl-full"></div>

            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base mb-4">
              🔥 網友熱議
            </h3>
            
            {/* Quotes Only */}
            {result.socialQuotes && result.socialQuotes.length > 0 ? (
               <div className="space-y-3">
                 {result.socialQuotes.map((quote, idx) => (
                   <div key={idx} className="bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border-l-4 border-[#E3D5C9]">
                     {quote}
                   </div>
                 ))}
               </div>
            ) : (
                <div className="text-slate-500 text-sm">暫無相關討論</div>
            )}
          </div>

          {/* 2. MOHW (Hidden for Values) */}
          {!isValueTopic && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-[#7ca9b0] flex items-center gap-2 text-base mb-4">
                🏥 衛福部/醫生建議
              </h3>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {result.mohwFacts}
              </div>
            </div>
          )}

          {/* 3. Journals (Hidden for Values) */}
          {!isValueTopic && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-[#7ca9b0] flex items-center gap-2 text-base mb-4">
                🔬 醫學實證/觀點
              </h3>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {result.journalResearch}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="text-center text-red-500 py-10">
          資料載入失敗，請稍後再試。
        </div>
      )}
    </div>
  );
};

export default AdviceView;