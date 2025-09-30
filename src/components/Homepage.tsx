import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { MessageCircle, Share } from 'lucide-react';
import { ReactComponent as BrandMark } from '../imports/00BrandMark.svg'; // ✅ SVGR import

interface HomepageProps {
  onJourneySelect: (journey: string) => void;
  onChatSelect: () => void;
  onIntroSelect?: () => void;
}

export function Homepage({ onJourneySelect, onChatSelect, onIntroSelect }: HomepageProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [likedTips, setLikedTips] = useState(new Set<string>());
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
    { id: 'travel', label: 'travel', tooltip: 'plan cheaper, lower-carbon trips' },
    { id: 'switch', label: 'switch', tooltip: 'save on bills with greener options' },
    { id: 'food', label: 'food', tooltip: 'eat well, waste less, spend less' },
    { id: 'home', label: 'home', tooltip: 'quick wins & upgrades' },
    { id: 'shop', label: 'shop', tooltip: 'buy better: used, efficient, ethical' },
    { id: 'waste', label: 'waste', tooltip: 'reduce, reuse, recycle near you' },
    { id: 'holiday', label: 'holiday', tooltip: 'eco-friendly breaks & getaways' }
  ];

  const setupJourney = { id: 'profile', label: 'setup', tooltip: 'get accurate money + CO₂ saves' };

  const tips = [
    { id: 'travel-1', category: 'TRAVEL', text: 'Taking the train cuts emissions by 84% compared to flying.' },
    { id: 'travel-2', category: 'TRAVEL', text: 'Book travel 2–3 months ahead to save up to 60%.' },
    { id: 'switch-1', category: 'SWITCH', text: 'Switching to green energy reduces your household carbon by 25%.' },
    { id: 'switch-2', category: 'SWITCH', text: 'Compare suppliers to save over £300/year on bills.' },
    { id: 'food-1', category: 'FOOD', text: 'Going meat-free 2 days a week can cut 200kg of CO₂ yearly.' },
    { id: 'food-2', category: 'FOOD', text: 'Batch cooking reduces waste and saves up to £25/month.' },
    { id: 'home-1', category: 'HOME', text: 'Turning your heating down 1°C saves 300kg of carbon/year.' },
    { id: 'home-2', category: 'HOME', text: 'Insulate your home to reduce energy bills by 20–30%.' },
    { id: 'shop-1', category: 'SHOP', text: 'Buying second-hand clothes cuts emissions by over 70%.' },
    { id: 'shop-2', category: 'SHOP', text: 'Look for local swap events and save hundreds yearly.' },
    { id: 'waste-1', category: 'WASTE', text: 'Recycling correctly reduces your footprint by up to 150kg CO₂/year.' },
    { id: 'waste-2', category: 'WASTE', text: 'Avoiding food waste could save £500 a year.' }
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const question = questions[currentQuestionIndex];

    if (currentQuestionIndex >= questions.length) {
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
            setTimeout(() => setShowButtons(true), 300);
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
      const newLiked = new Set(prev);
      newLiked.has(tipId) ? newLiked.delete(tipId) : newLiked.add(tipId);
      return newLiked;
    });
  };

  const toggleSavedTips = () => setShowSavedTips(prev => !prev);

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
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch {
      window.open('https://www.instagram.com/percyzerozero/', '_blank');
    }
  };

  const savedTips = tips.filter(tip => likedTips.has(tip.id));
  const hasSavedTips = savedTips.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Brandmark */}
      <div className="pt-12 pb-6 text-center">
        <div className="flex justify-center">
          <BrandMark className="w-16 h-24 text-white" /> {/* ✅ cleaner */}
        </div>
      </div>

      {/* Animated Questions */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-4xl">
          <div className="h-[200px] py-2.5 flex items-center justify-center mb-8 lg:mb-12">
            <h2 className="text-[60px] font-extrabold lowercase leading-tight text-balance">
              {displayText}
            </h2>
          </div>

          <div className="h-5" />

          <div className="min-h-[180px]">
            <div
              className={`transition-all duration-500 ${
                showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <div className="mb-6 space-y-4">
                <button
                  onClick={() => onJourneySelect(setupJourney.id)}
                  title={setupJourney.tooltip}
                  className="btn-80 btn-primary text-[20px] font-bold text-white uppercase"
                >
                  start
                </button>
              </div>

              <div className="pill-row mb-16">
                {mainJourneys.map((journey) => (
                  <button
                    key={journey.id}
                    onClick={() => onJourneySelect(journey.id)}
                    title={journey.tooltip}
                    className="pill btn-secondary text-[20px] font-bold text-white uppercase"
                  >
                    {journey.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      {/* ... keep rest of code unchanged ... */}
    </div>
  );
}
