import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MessageCircle, Share, Car, Plug, UtensilsCrossed, Home, ShoppingBag, Recycle, Tent, Banknote, HeartPulse, Plus } from 'lucide-react';
import Component00BrandMark from '../imports/00BrandMark-2-28';
import { LikesPopup } from './LikesPopup';

interface HomepageProps {
  onJourneySelect: (journey: string) => void;
  onChatSelect: () => void;
  onIntroSelect?: () => void;
  onSignupClick?: () => void;
}

export function Homepage({ onJourneySelect, onChatSelect, onIntroSelect, onSignupClick }: HomepageProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [likedTips, setLikedTips] = useState<Map<string, any>>(() => {
    try {
      const stored = localStorage.getItem('zz-liked-tips');
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Map(Object.entries(parsed));
      }
    } catch (e) {
      console.error('Error loading liked tips:', e);
    }
    return new Map();
  });
  const [showSavedTips, setShowSavedTips] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const questions = [
    'save on travel?',
    'green energy switch?',
    'eat better, cheaper?',
    'home upgrades?',
    'sustainable shopping?',
    'cut waste?',
    'eco holiday?',
    'your impact?'
  ];

  const mainJourneys = [
    { id: 'travel', label: 'travel', tooltip: 'plan cheaper, lower-carbon trips', icon: Car },
    { id: 'switch', label: 'switch', tooltip: 'save on bills with greener options', icon: Plug },
    { id: 'food', label: 'food', tooltip: 'eat well, waste less, spend less', icon: UtensilsCrossed },
    { id: 'home', label: 'home', tooltip: 'quick wins & upgrades', icon: Home },
    { id: 'shop', label: 'shop', tooltip: 'buy better: used, efficient, ethical', icon: ShoppingBag },
    { id: 'waste', label: 'waste', tooltip: 'reduce, reuse, recycle near you', icon: Recycle },
    { id: 'holiday', label: 'holiday', tooltip: 'eco-friendly breaks & getaways', icon: Tent },
    { id: 'money', label: 'money', tooltip: 'save money & switch to eco options', icon: Banknote },
    { id: 'health', label: 'health', tooltip: 'healthy habits & sustainable living', icon: HeartPulse }
  ];

  const setupJourney = { id: 'profile', label: 'setup', tooltip: 'get accurate money + CO₂ saves' };

  const tips = [
    // travel
    { id: 'travel-1', category: 'TRAVEL', text: 'Taking the train cuts emissions by 84% compared to flying.', href: 'https://www.thetrainline.com/' },
    { id: 'travel-2', category: 'TRAVEL', text: 'Book travel 2–3 months ahead to save up to 60%.', href: 'https://www.skyscanner.net/' },
    // switch
    { id: 'switch-1', category: 'SWITCH', text: 'Switching to green energy reduces your household carbon by 25%.', href: 'https://octopus.energy/' },
    { id: 'switch-2', category: 'SWITCH', text: 'Compare suppliers to save over £300/year on bills.', href: 'https://www.uswitch.com/' },
    // food
    { id: 'food-1', category: 'FOOD', text: 'Going meat-free 2 days a week can cut 200kg of CO₂ yearly.', href: 'https://www.veganuary.com/' },
    { id: 'food-2', category: 'FOOD', text: 'Batch cooking reduces waste and saves up to £25/month.', href: 'https://www.bbcgoodfood.com/' },
    // home
    { id: 'home-1', category: 'HOME', text: 'Turning your heating down 1°C saves 300kg of carbon/year.', href: 'https://www.energysavingtrust.org.uk/' },
    { id: 'home-2', category: 'HOME', text: 'Insulate your home to reduce energy bills by 20–30%.', href: 'https://www.energysavingtrust.org.uk/' },
    // shop
    { id: 'shop-1', category: 'SHOP', text: 'Buying second-hand clothes cuts emissions by over 70%.', href: 'https://www.vinted.co.uk/' },
    { id: 'shop-2', category: 'SHOP', text: 'Look for local swap events and save hundreds yearly.', href: 'https://www.swishing.com/' },
    // waste
    { id: 'waste-1', category: 'WASTE', text: 'Recycling correctly reduces your footprint by up to 150kg CO₂/year.', href: 'https://www.recyclenow.com/' },
    { id: 'waste-2', category: 'WASTE', text: 'Avoiding food waste could save £500 a year.', href: 'https://www.lovefoodhatewaste.com/' },
    // money
    { id: 'money-1', category: 'MONEY', text: 'Switching to ethical banks divests from fossil fuels and funds renewables.', href: 'https://www.triodos.co.uk/' },
    { id: 'money-2', category: 'MONEY', text: 'Compare energy tariffs to save £240+ per year with green power.', href: 'https://octopus.energy/' },
    // health
    { id: 'health-1', category: 'HEALTH', text: 'Walking 30 mins daily = free fitness + save 120kg CO₂ per year.', href: 'https://www.nhs.uk/live-well/exercise/walking-for-health/' },
    { id: 'health-2', category: 'HEALTH', text: 'Plant-based diet improves health & cuts carbon by 500kg yearly.', href: 'https://www.veganuary.com/' }
  ];

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const question = questions[currentQuestionIndex];

    if (currentQuestionIndex >= questions.length) {
      // Loop back to first question, don't hide buttons
      setTimeout(() => {
        setCurrentQuestionIndex(0);
        setDisplayText('');
      }, 1800);
      return;
    }

    if (prefersReducedMotion) {
      setDisplayText(question);
      if (!showButtons && currentQuestionIndex === 0) {
        setTimeout(() => setShowButtons(true), 300);
      }
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setDisplayText('');
      }, 1800);
    } else {
      let charIndex = 0;
      const typeWriter = () => {
        if (charIndex < question.length) {
          setDisplayText(question.substring(0, charIndex + 1));
          charIndex++;
          setTimeout(typeWriter, 65);
        } else {
          if (!showButtons && currentQuestionIndex === 0) {
            setTimeout(() => setShowButtons(true), 300); // fade in once
          }
          setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
            setDisplayText('');
          }, 1800);
        }
      };
      typeWriter();
    }
  }, [currentQuestionIndex, prefersReducedMotion]);

  const toggleLike = (tipId: string) => {
    setLikedTips(prev => {
      const newLiked = new Map(prev);
      if (newLiked.has(tipId)) {
        newLiked.delete(tipId);
      } else {
        const tip = tips.find(t => t.id === tipId);
        if (tip) {
          newLiked.set(tipId, tip);
        }
      }
      
      // Persist to localStorage
      try {
        const obj = Object.fromEntries(newLiked);
        localStorage.setItem('zz-liked-tips', JSON.stringify(obj));
      } catch (e) {
        console.error('Error saving liked tips:', e);
      }
      
      return newLiked;
    });
  };

  // Adapter for LikesPopup - converts tip object to toggleLike call
  const handleToggleLikeFromPopup = (tip: any) => {
    toggleLike(tip.id);
  };

  const toggleSavedTips = () => {
    setShowSavedTips(prev => !prev);
  };

  const handleShare = async (tip?: any) => {
    const shareData = {
      title: tip ? `${tip.category}: ${tip.text}` : 'Zero Zero - Save money & carbon',
      text: tip ? tip.text : 'Check out Zero Zero for money-saving and carbon-reducing tips!',
      url: tip?.href || 'https://www.instagram.com/percyzerozero/'
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

  const savedTips = Array.from(likedTips.values());
  const hasSavedTips = savedTips.length > 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000', color: '#fff' }}>
      {/* Brandmark */}
      <div className="pt-12 pb-6 text-center">
        <div className="flex justify-center">
          <div className="h-[60px] w-auto flex items-center justify-center">
            {/* Fixed container for brand mark - prevents distortion */}
            <div className="w-16 h-24 relative text-white">
              <Component00BrandMark />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Questions - Fixed Height Container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-4xl">
          {/* Fixed height question area so layout never shifts */}
          <div className="h-[200px] w-full max-w-[480px] mx-auto flex items-center justify-center mb-8 lg:mb-12 px-5">
            <h2 className="text-[58px] font-extrabold lowercase leading-tight text-balance">
              {displayText}
            </h2>
          </div>

          <div className="h-5" /> {/* 20px spacer between question and buttons */}

          {/* Fixed Button Container - prevents layout shifts */}
          <div className="min-h-[320px]">
            <div
              className={`transition-all duration-500 ${
                showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              {/* Setup Button */}
              <div className="mb-6 space-y-4">
                <button
                  onClick={() => onJourneySelect(setupJourney.id)}
                  title={setupJourney.tooltip}
                  className="btn-80 btn-primary uppercase"
                >
                  start
                </button>
                
                {/* Test Intro Button */}
                {onIntroSelect && (
                  <div>

                  </div>
                )}
              </div>

              {/* Main Journey Buttons - Responsive Grid: 3 cols (3 rows), 5 cols (2 rows), 9 cols (1 row) */}
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-16 mx-auto">
                {mainJourneys.map((journey) => {
                  const Icon = journey.icon;
                  return (
                    <button
                      key={journey.id}
                      onClick={() => onJourneySelect(journey.id)}
                      title={journey.tooltip}
                      className="btn-80 btn-primary flex-col gap-1"
                    >
                      <Icon size={20} strokeWidth={1.5} />
                      <span className="text-[10px] font-bold uppercase">{journey.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="px-4 lg:px-8 pb-16">
        <div className="w-full max-w-4xl mx-auto">
          <h4 className="text-[28px] font-extrabold uppercase text-center mb-8 fade-in" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>tips for you</h4>
          
          <div className="flex flex-col gap-8">
            {tips.map((tip) => (
              <Card 
                key={tip.id} 
                className="bg-white/5 border-none rounded-2xl p-6 lg:p-10 w-full max-w-[720px] mx-auto animate-in fade-in duration-500 flex flex-col justify-between"
              >
                {/* Category */}
                <p className="text-[20px] font-bold text-white uppercase mb-3">
                  {tip.category}
                </p>
                
                {/* Tip text */}
                <p className="text-[16px] font-bold text-white/80 mb-6">
                  {tip.text}
                </p>
                
                {/* Buttons row */}
                <div className="flex items-center gap-4 mt-auto">
                  <a
                    href={tip.href || 'https://www.instagram.com/percyzerozero/'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-white text-black font-bold uppercase px-6 py-2 rounded-full text-[16px] hover:bg-white/90 transition-colors duration-200">
                      more
                    </button>
                  </a>
                  
                  <button
                    onClick={() => handleShare(tip)}
                    className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
                    aria-label="Share tip"
                  >
                    <Share size={20} />
                  </button>
                  
                  <button
                    onClick={() => toggleLike(tip.id)}
                    className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
                    aria-label={likedTips.has(tip.id) ? "Unlike tip" : "Like tip"}
                  >
                    {likedTips.has(tip.id) ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Follow Button */}
      <div className="text-center mb-[120px]">
        <a
          href="https://www.instagram.com/percyzerozero/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <button 
            className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 active:bg-black active:text-white transition-all duration-200 flex items-center justify-center"
            aria-label="Follow on Instagram"
          >
            <Plus size={24} strokeWidth={1.5} />
          </button>
        </a>
      </div>

      {/* Fixed Bottom Navigation */}
      {/* Chat Button - Bottom Left */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 50 }}>
        <button
          onClick={onChatSelect}
          className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
          aria-label="Chat with Zai"
        >
          <MessageCircle size={20} />
        </button>
      </div>

      {/* Signup Button - Bottom Center */}
      {/* Signup Button - Top Right */}
      {onSignupClick && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50 }}>
          <button
            onClick={onSignupClick}
            className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
            aria-label="Sign up for more tips"
          >
            <Plus size={20} />
          </button>
        </div>
      )}

      {/* Likes Button - Bottom Right */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50 }}>
        <button
          onClick={toggleSavedTips}
          className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
          aria-label="Open saved tips"
        >
          {hasSavedTips ? (
            // Solid heart when there are saved tips
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            // Outline heart when no saved tips
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          )}
        </button>

        {/* Badge showing number of saved tips */}
        {hasSavedTips && (
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
            {savedTips.length}
          </div>
        )}
      </div>

      {/* Likes Popup */}
      <LikesPopup
        isOpen={showSavedTips}
        onClose={toggleSavedTips}
        likedResults={likedTips}
        onToggleLike={handleToggleLikeFromPopup}
        title="saved tips"
      />
    </div>
  );
}