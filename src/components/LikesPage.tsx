import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Share } from 'lucide-react';

interface LikesPageProps {
  likedResults: Set<string>;
  allResults: any[];
  onToggleLike: (result: any) => void;
  onBack: () => void;
  onHome: () => void;
  onChat?: () => void;
}

export function LikesPage({ likedResults, allResults, onToggleLike, onBack, onHome, onChat }: LikesPageProps) {
  const [visibleCards, setVisibleCards] = useState(0);

  const handleShare = async (item?: any) => {
    const shareData = {
      title: item?.title ? `${item.title} result` : 'Zero Zero - Saved results',
      text: item?.rationale || 'Check out my saved results from Zero Zero!',
      url: item?.href || 'https://www.instagram.com/percyzerozero/'
    };

    try {
      if (navigator.share && 'canShare' in navigator && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch (error) {
      // Silent fallback to Instagram URL
      window.open('https://www.instagram.com/percyzerozero/', '_blank');
    }
  };

  // Filter results to only show liked ones
  const savedResults = allResults.filter(result => 
    likedResults.has(`${result.title}-${result.provider}`)
  );

  React.useEffect(() => {
    // Staggered card animation
    const timers = savedResults.map((_, index) => 
      setTimeout(() => setVisibleCards(prev => Math.max(prev, index + 1)), index * 120)
    );
    return () => timers.forEach(clearTimeout);
  }, [savedResults.length]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="pt-8 md:pt-12 pb-6 text-center">
        {/* Button Row */}
        <div className="flex items-center justify-between px-5 mb-6 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={onHome}
            aria-label="Go home"
            className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>
        
        {/* Title */}
        <h4 className="text-[40px] font-extrabold uppercase text-white">saved results</h4>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 lg:px-10 pb-24">
        <div className="w-full max-w-6xl mx-auto">
          {savedResults.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[20px] font-bold text-white/60 mb-8">
                no saved results yet
              </p>
              <p className="text-[16px] font-bold text-white/40">
                tap the heart icon on any result to save it
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {savedResults.map((result, index) => (
                <div 
                  key={`${result.title}-${result.provider}`}
                  className={`bg-white/5 rounded-2xl transition-all duration-500 transform ${
                    visibleCards > index 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="p-6 lg:p-10">
                    <div className="flex flex-col">
                      {/* Title */}
                      <h3 className="text-[36px] lg:text-[60px] font-extrabold lowercase leading-none mb-4 text-white">
                        {result.title}
                      </h3>
                      
                      {/* Provider */}
                      <p className="text-[16px] lg:text-[20px] font-bold mb-6 text-white">
                        {result.provider}
                      </p>
                      
                      {/* Price and Carbon */}
                      <div className="flex items-baseline gap-8 mb-6">
                        <span className="text-[28px] lg:text-[40px] font-bold text-white">
                          {result.price}
                        </span>
                        {result.carbon && (
                          <span className="text-[18px] lg:text-[24px] font-bold text-white/60">
                            {result.carbon}
                          </span>
                        )}
                      </div>
                      
                      {/* Rationale */}
                      <p className="text-[14px] lg:text-[16px] font-bold text-white/80 mb-6">
                        {result.rationale}
                      </p>
                      
                      {/* CTA + Share + Like Row */}
                      <div className="flex items-center gap-4">
                        <a
                          href={result.href}
                          target="_blank"
                          rel="noopener nofollow sponsored"
                        >
                          <button className="bg-white text-black font-bold uppercase px-6 py-2 rounded-full text-[16px] hover:bg-white/90 transition-colors duration-200">
                            {result.cta}
                          </button>
                        </a>
                        
                        <button 
                          onClick={() => handleShare(result)}
                          className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
                          aria-label="Share result"
                        >
                          <Share size={20} />
                        </button>
                        
                        <button 
                          onClick={() => onToggleLike(result)}
                          className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
                          aria-label="Remove from saved"
                        >
                          {/* Always solid heart since these are saved results */}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      {/* Chat Button - Bottom Left */}
      {onChat && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 50 }}>
          <button
            onClick={onChat}
            className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
            aria-label="Chat with Zai"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Likes Button - Bottom Right (current page indicator) */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50 }}>
        <button
          className="w-14 h-14 rounded-full bg-white/20 transition-colors duration-200 flex items-center justify-center text-white"
          aria-label="Current page: Likes"
          disabled
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
        {/* Like Counter Badge */}
        {likedResults.size > 0 && (
          <div style={{ 
            position: 'absolute', 
            top: '-8px', 
            right: '-8px', 
            width: '20px', 
            height: '20px',
            background: 'white',
            color: 'black',
            fontSize: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {likedResults.size}
          </div>
        )}
      </div>

      {/* Home Button - Bottom Center */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        <button 
          onClick={onHome}
          className="btn-80 btn-primary"
        >
          home
        </button>
      </div>
    </div>
  );
}