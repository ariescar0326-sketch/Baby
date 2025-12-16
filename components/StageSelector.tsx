import React, { useEffect, useRef } from 'react';
import { STAGES } from '../constants';
import { Stage, StageId } from '../types';

interface StageSelectorProps {
  onSelect: (stage: Stage) => void;
}

const StageSelector: React.FC<StageSelectorProps> = ({ onSelect }) => {
  const defaultStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to "Born" on mount
    if (defaultStageRef.current) {
      defaultStageRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, []);

  return (
    // [&::-webkit-scrollbar]:hidden hides the scrollbar to make it look like a native app feed
    <div className="w-full h-full overflow-y-auto snap-y snap-mandatory bg-slate-50 [&::-webkit-scrollbar]:hidden">
      {/* Spacer for top */}
      <div className="h-4"></div>
      
      <div className="flex flex-col items-center pb-20 px-4">
        {STAGES.map((stage) => {
          const isBorn = stage.id === StageId.NEWBORN_BIRTH;
          
          return (
            <React.Fragment key={stage.id}>
              {/* Separator for Birth */}
              {isBorn && (
                <div className="sticky top-0 z-10 flex items-center justify-center py-2 bg-slate-50/90 backdrop-blur-sm mb-4 w-full">
                  <span className="text-sm font-bold text-white bg-rose-500 px-4 py-1 rounded-full shadow-sm animate-pulse">
                    恭喜出生!
                  </span>
                </div>
              )}

              <div 
                ref={isBorn ? defaultStageRef : null}
                className="w-full max-w-lg snap-start py-2"
              >
                <button
                  onClick={() => onSelect(stage)}
                  className={`w-full flex items-center p-6 rounded-3xl transition-all duration-300 relative overflow-hidden group
                    ${isBorn 
                      ? 'bg-white shadow-lg border border-blue-100 ring-2 ring-blue-50' 
                      : 'bg-white shadow-sm border border-slate-100 opacity-90 hover:opacity-100'
                    }`}
                >
                  {/* Icon Container */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mr-5 shadow-inner
                    ${isBorn ? 'bg-blue-50' : 'bg-slate-50 group-hover:bg-blue-50 transition-colors'}`}>
                    {stage.icon}
                  </div>

                  <div className="text-left flex-grow">
                    <h3 className={`text-xl font-bold mb-1 ${isBorn ? 'text-slate-800' : 'text-slate-700'}`}>
                      {stage.label}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs font-medium opacity-80">
                      {stage.subLabel && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                          {stage.subLabel}
                        </span>
                      )}
                      <span className="text-slate-400 flex items-center">
                         {stage.description}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-slate-300 group-hover:text-blue-400 transition-colors group-hover:translate-x-1 duration-300">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StageSelector;