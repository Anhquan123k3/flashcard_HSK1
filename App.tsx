import { useState, useCallback, useEffect, useRef } from 'react';
import { hskData } from './data';
import Card from './components/Card';
import { ArrowLeft, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentItem = hskData[currentIndex];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const changeCard = useCallback((newIndex: number) => {
    if (isAnimating) return;
    
    // If flipped (showing back), flip to front first
    if (isFlipped) {
        setIsAnimating(true);
        setIsFlipped(false);
        // Wait for card to be edge-on (90deg) or fully flipped before changing content
        // Duration is 500ms, so 250ms is halfway
        timerRef.current = window.setTimeout(() => {
            setCurrentIndex(newIndex);
            setIsAnimating(false);
            timerRef.current = null;
        }, 250); 
    } else {
        // If already on front, change immediately
        setCurrentIndex(newIndex);
    }
  }, [isFlipped, isAnimating]);

  const handleNext = useCallback(() => {
    changeCard((currentIndex + 1) % hskData.length);
  }, [changeCard, currentIndex]);

  const handlePrev = useCallback(() => {
    changeCard((currentIndex - 1 + hskData.length) % hskData.length);
  }, [changeCard, currentIndex]);

  const handleFlip = useCallback(() => {
    if (isAnimating) return;
    setIsFlipped((prev) => !prev);
  }, [isAnimating]);

  const handleShuffle = useCallback(() => {
     const randomIndex = Math.floor(Math.random() * hskData.length);
     changeCard(randomIndex);
  }, [changeCard]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.key === 'Enter') handleFlip();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFlip, isAnimating]);

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-slate-800 flex flex-col items-center py-6 px-4 md:px-0 font-sans">
      
      {/* Header Area */}
      <header className="w-full max-w-md flex justify-between items-center mb-6 pt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Flashcards</h1>
          <p className="text-slate-500 text-sm mt-1">HSK Level 1 Vocabulary</p>
        </div>
        <div className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100 overflow-hidden">
             {/* Using a generic placeholder if image fails, or a simple icon */}
             <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                HSK
             </div>
        </div>
      </header>

      {/* Tabs / Filter (Visual only for now) */}
      <div className="w-full max-w-md bg-white p-1 rounded-2xl flex mb-8 shadow-sm border border-gray-200">
        <button className="flex-1 py-2 px-4 rounded-xl bg-slate-900 text-white font-medium text-sm shadow-md transition-all">
          Learning
        </button>
        <button className="flex-1 py-2 px-4 rounded-xl text-slate-500 font-medium text-sm hover:bg-gray-50 transition-all">
          Review
        </button>
      </div>

      {/* Card Area */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center relative">
        
        {/* Progress Text */}
        <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-sm font-semibold text-slate-400">
                Card {currentIndex + 1} <span className="text-slate-300">/</span> {hskData.length}
            </span>
            <button onClick={handleShuffle} className="text-blue-500 hover:text-blue-600 transition-colors p-2" title="Shuffle">
                <RotateCcw size={18} />
            </button>
        </div>

        {/* The Card Component */}
        <div className="relative mb-8">
            {/* Background Stack Effect */}
            <div className="absolute top-4 left-4 right-4 -bottom-4 bg-gray-200 rounded-3xl z-0 transform scale-[0.95] opacity-60"></div>
            <div className="absolute top-2 left-2 right-2 -bottom-2 bg-gray-300 rounded-3xl z-0 transform scale-[0.98] opacity-80"></div>
            
            {/* Active Card */}
            <div className="relative z-10">
                <Card 
                  item={currentItem} 
                  isFlipped={isFlipped} 
                  onFlip={handleFlip} 
                />
            </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-6 mt-auto mb-6">
            <button 
                onClick={handlePrev}
                className="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-lg text-slate-400 flex items-center justify-center hover:bg-gray-50 hover:text-blue-500 hover:border-blue-100 hover:scale-105 active:scale-95 transition-all duration-300"
                aria-label="Previous card"
            >
                <ArrowLeft size={28} />
            </button>

            <button
                onClick={handleFlip}
                className="flex-1 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all duration-300"
            >
                <BookOpen size={20} />
                {isFlipped ? 'Show Pinyin' : 'Reveal Meaning'}
            </button>

            <button 
                onClick={handleNext}
                className="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-lg text-slate-400 flex items-center justify-center hover:bg-gray-50 hover:text-blue-500 hover:border-blue-100 hover:scale-105 active:scale-95 transition-all duration-300"
                aria-label="Next card"
            >
                <ArrowRight size={28} />
            </button>
        </div>

      </main>
    </div>
  );
}