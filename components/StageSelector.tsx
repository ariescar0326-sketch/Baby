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
    // Main Background: #E3E8EB
    <div className="w-full h-full overflow-y-auto snap-y snap-mandatory bg-[#E3E8EB] [&::-webkit-scrollbar]:hidden">
      {/* Spacer for top */}
      <div className="h-4"></div>
      
      <div className="flex flex-col items-center pb-20 px-4">
        {STAGES.map((stage) => {
          const isBorn = stage.id === StageId.NEWBORN_BIRTH;
          
          return (
            <React.Fragment key={stage.id}>
              {/* Separator for Birth */}
              {isBorn && (
                <div className="sticky top-0 z-10 flex items-center justify-center py-2 bg-[#E3E8EB]/90 backdrop-blur-sm mb-4 w-full">
                  <span className="text-sm font-bold text-white bg-[#A3D5DC] text-slate-700 px-4 py-1 rounded-full shadow-sm animate-pulse border border-white/50">
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
                  // Default bg-[#E3E8EB] (blends in) with border. Active/Hover: bg-[#F3EFDD]
                  className={`w-full flex items-center p-6 rounded-3xl transition-all duration-300 relative overflow-hidden group border-2
                    ${isBorn 
                      ? 'bg-[#F3EFDD] shadow-lg border-[#E3D5C9] scale-100' 
                      : 'bg-[#E3E8EB] border-slate-300 hover:bg-[#F3EFDD] hover:border-[#E3D5C9]'
                    }`}
                >
                  {/* Icon Container */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mr-5 shadow-sm transition-colors
                    ${isBorn ? 'bg-white' : 'bg-slate-100 group-hover:bg-white'}`}>
                    {stage.icon}
                  </div>

                  <div className="text-left flex-grow">
                    <h3 className="text-xl font-bold mb-1 text-slate-800">
                      {stage.label}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs font-medium opacity-80">
                      {stage.subLabel && (
                        <span className="bg-[#A3D5DC] px-2 py-0.5 rounded text-slate-700">
                          {stage.subLabel}
                        </span>
                      )}
                      <span className="text-slate-500 flex items-center">
                         {stage.description}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-[#A3D5DC] group-hover:text-[#8bc0c7] transition-colors group-hover:translate-x-1 duration-300">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
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