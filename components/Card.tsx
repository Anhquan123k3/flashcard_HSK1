import React from 'react';
import { VocabularyItem } from '../types';
import { Volume2 } from 'lucide-react';

interface CardProps {
  item: VocabularyItem;
  isFlipped: boolean;
  onFlip: () => void;
}

const Card: React.FC<CardProps> = ({ item, isFlipped, onFlip }) => {
  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simple mock TTS using browser API if available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(item.hanzi);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      className="relative w-full aspect-[3/4] max-h-[550px] cursor-pointer perspective-1000 group select-none"
      onClick={onFlip}
    >
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-all ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face (Pinyin) */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col justify-between overflow-hidden relative">
             {/* Decorative colored bar at top */}
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>

             <div className="flex justify-between items-start mt-4">
                <span className="text-sm font-semibold text-gray-400 tracking-wider">HSK 1 VOCABULARY</span>
                <button 
                  onClick={handleAudio}
                  className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Volume2 size={20} />
                </button>
             </div>

             <div className="flex-1 flex flex-col justify-center items-center gap-6">
                <h2 className="text-5xl font-bold text-gray-800 text-center">{item.pinyin}</h2>
                <p className="text-gray-400 text-sm">Tap to reveal meaning</p>
             </div>

             {/* Bottom decorative elements */}
             <div className="w-full h-1 bg-gray-100 rounded-full mt-4">
                <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
             </div>
          </div>
        </div>

        {/* Back Face (Hanzi + Meaning) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-slate-900 rounded-3xl shadow-xl border border-slate-800 p-8 flex flex-col justify-between relative overflow-hidden text-white">
             {/* Decorative circles for background interest */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

             <div className="flex justify-between items-start mt-4 relative z-10">
                <span className="text-sm font-semibold text-slate-400 tracking-wider">MEANING</span>
                <button 
                  onClick={handleAudio}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <Volume2 size={20} />
                </button>
             </div>

             <div className="flex-1 flex flex-col justify-center items-center text-center z-10 space-y-6">
                <div>
                   <h1 className="text-7xl font-bold font-chinese mb-2">{item.hanzi}</h1>
                   <p className="text-xl text-blue-400 font-medium">{item.pinyin}</p>
                </div>
                
                <div className="w-full h-px bg-slate-700 my-2"></div>

                <div className="space-y-3">
                  <p className="text-2xl font-semibold text-white">{item.meaningVi}</p>
                  <p className="text-sm text-slate-400 italic">{item.meaningEn}</p>
                </div>

                {item.example && (
                   <div className="mt-4 p-4 bg-slate-800/50 rounded-xl w-full">
                      <p className="text-sm text-slate-300 font-chinese">{item.example.split('.')[1] || item.example}</p>
                   </div>
                )}
             </div>
             
             <div className="w-full text-center mt-4">
                <p className="text-xs text-slate-500">Tap to flip back</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Card;