import React, { useState } from 'react';
import { Stage, Topic } from './types';
import StageSelector from './components/StageSelector';
import TopicSelector from './components/TopicSelector';
import AdviceView from './components/AdviceView';

const App: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleStageSelect = (stage: Stage) => {
    setSelectedStage(stage);
    setSelectedTopic(null);
  };

  const handleReset = () => {
    setSelectedStage(null);
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm h-14 flex items-center justify-center">
        <div className="w-full max-w-2xl px-4 flex items-center justify-between relative">
          
          {/* Back Button (Only shows when deep in navigation) */}
          <div className="w-8">
            {selectedStage && (
              <button 
                onClick={handleReset}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            )}
          </div>

          <h1 className="text-lg font-bold tracking-tight text-slate-800 absolute left-1/2 -translate-x-1/2">
            科學奶爸
          </h1>

          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-2xl mx-auto bg-slate-50">
        
        {!selectedStage && (
          <StageSelector onSelect={handleStageSelect} />
        )}

        {selectedStage && !selectedTopic && (
          <TopicSelector 
            stage={selectedStage} 
            onSelectTopic={setSelectedTopic}
            onBack={() => setSelectedStage(null)} 
          />
        )}

        {selectedStage && selectedTopic && (
          <AdviceView 
            stage={selectedStage}
            topic={selectedTopic}
            onBack={() => setSelectedTopic(null)}
          />
        )}

      </main>
    </div>
  );
};

export default App;