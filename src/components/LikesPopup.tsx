import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Share } from 'lucide-react';

interface LikesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  likedResults: Map<string, any>;
  onToggleLike: (result: any) => void;
  title?: string;
}

export function LikesPopup({ isOpen, onClose, likedResults, onToggleLike, title = 'your likes' }: LikesPopupProps) {
  const [visibleCards, setVisibleCards] = useState(0);
  const [removingCards, setRemovingCards] = useState<Set<string>>(new Set());

  const handleShare = async (item: any) => {
    const shareData = {
      title: item?.title ? `${item.title} from Zero Zero` : 'Zero Zero - My saved items',
      text: item?.rationale || item?.text || 'Check out what I saved from Zero Zero!',
      url: item?.href || 'https://www.instagram.com/percyzerozero/'
    };

    try {
      if (navigator.share && 'canShare' in navigator && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch (error) {
      window.open('https://www.instagram.com/percyzerozero/', '_blank');
    }
  };

  const handleUnlike = (result: any) => {
    const identifier = result.provider || result.category;
    const resultKey = `${result.title}-${identifier}`;
    
    // Add to removing set for fade-out animation
    setRemovingCards(prev => new Set(prev).add(resultKey));
    
    // Remove after animation completes
    setTimeout(() => {
      onToggleLike(result);
      setRemovingCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(resultKey);
        return newSet;
      });
    }, 300);
  };

  const savedResults = Array.from(likedResults.values());

  // Stagger card entrance animation
  useEffect(() => {
    if (isOpen) {
      setVisibleCards(0);
      const timers = savedResults.map((_, index) => 
        setTimeout(() => setVisibleCards(prev => Math.max(prev, index + 1)), index * 100)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen, savedResults.length]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - solid black */}
      <div 
        className="fixed inset-0 bg-black z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Popup Container - slides up from bottom */}
      <div 
        className="fixed inset-0 z-50 flex items-end lg:items-center justify-center pointer-events-none"
        onClick={onClose}
      >
        <div 
          className="w-full lg:w-auto lg:max-w-[720px] bg-black rounded-t-2xl lg:rounded-2xl pointer-events-auto animate-slide-up overflow-hidden"
          style={{
            maxHeight: '80vh',
            height: '80vh'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content - Scrollable */}
          <div className="p-6 lg:p-10 h-full overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[28px] font-extrabold lowercase text-white">
                {title}
              </h4>
              <button
                onClick={onClose}
                className="btn-ghost text-[28px] text-white hover:text-white/80 transition-colors duration-200 leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            {savedResults.length === 0 ? (
              <p className="text-[16px] font-bold text-white/40 text-center py-8">
                no saved items yet. tap a heart to save tips or results.
              </p>
            ) : (
              <div className="space-y-6">
                {savedResults.map((result, index) => {
                  const identifier = result.provider || result.category;
                  const resultKey = `${result.title}-${identifier}`;
                  const displayTitle = result.category || result.title;
                  const displayText = result.text || result.provider;
                  const displayCta = result.cta || 'visit';
                  const isRemoving = removingCards.has(resultKey);
                  const isVisible = visibleCards > index;
                  
                  return (
                    <Card 
                      key={resultKey} 
                      className={`bg-white/5 border-none rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                        isRemoving 
                          ? 'opacity-0 translate-y-4' 
                          : isVisible 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-8'
                      }`}
                    >
                      {/* Title/Category */}
                      <p className="text-[20px] font-bold text-white uppercase mb-3">
                        {displayTitle}
                      </p>
                      
                      {/* Text/Provider + Details */}
                      <div className="mb-6">
                        <p className="text-[16px] font-bold text-white/80 mb-2">
                          {displayText}
                        </p>
                        
                        {/* Additional details for journey results */}
                        {result.price && (
                          <div className="flex items-baseline gap-4 mt-3">
                            <span className="text-[20px] font-bold text-white">
                              {result.price}
                            </span>
                            {result.carbon && (
                              <span className="text-[16px] font-bold text-white/60">
                                {result.carbon}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Rationale for journey results */}
                        {result.rationale && (
                          <p className="text-[14px] font-bold text-white/60 mt-2">
                            {result.rationale}
                          </p>
                        )}
                      </div>
                      
                      {/* Buttons row */}
                      <div className="flex items-center gap-4 mt-auto">
                        {result.href && (
                          <a
                            href={result.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button className="bg-white text-black font-bold uppercase px-6 py-2 rounded-full text-[16px] hover:bg-white/90 transition-colors duration-200">
                              {displayCta}
                            </button>
                          </a>
                        )}
                        
                        <button
                          onClick={() => handleShare(result)}
                          className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
                          aria-label="Share"
                        >
                          <Share size={20} />
                        </button>
                        
                        <button
                          onClick={() => handleUnlike(result)}
                          className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
                          aria-label="Unlike"
                        >
                          {/* Always solid heart since these are saved items */}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
