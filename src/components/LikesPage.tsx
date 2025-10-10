import React from 'react';
import { Card } from './ui/card';
import { Share } from 'lucide-react';

interface LikesPageProps {
  likedResults: Map<string, any>;
  onToggleLike: (result: any) => void;
  onBack: () => void;
  onHome: () => void;
  onChat?: () => void;
}

export function LikesPage({ likedResults, onToggleLike, onBack, onHome, onChat }: LikesPageProps) {
  const handleShare = async (item?: any) => {
    const shareData = {
      title: item?.title ? `${item.title} result` : 'Zero Zero - Saved results',
      text: item?.rationale || item?.text || 'Check out my saved results from Zero Zero!',
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

  // Get all liked results from the Map
  const savedResults = Array.from(likedResults.values());

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Backdrop - for consistency with drawer approach */}
      <div className="fixed inset-0 bg-black z-40" />
      
      {/* Main Content - structured like a drawer */}
      <div className="fixed inset-0 bg-black/95 z-50 overflow-auto">
        <div className="max-w-[480px] mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[28px] font-extrabold lowercase">saved results</h4>
            <button
              onClick={onBack}
              className="btn-ghost text-[20px] uppercase"
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          {savedResults.length === 0 ? (
            <p className="text-[16px] font-bold text-white/40 text-center py-8">
              no saved results yet. tap a heart to save results.
            </p>
          ) : (
            <div className="space-y-4">
              {savedResults.map((result) => {
                // Support both journey results (provider) and tips (category)
                const identifier = result.provider || result.category;
                const displayTitle = result.category || result.title;
                const displayText = result.text || result.provider;
                const displayCta = result.cta || 'visit';
                
                return (
                  <Card key={`${result.title}-${identifier}`} className="bg-white/5 border-none rounded-2xl p-6 flex flex-col justify-between">
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
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
