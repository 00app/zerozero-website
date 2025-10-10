/**
 * Zero Zero - Main Application
 * 
 * Minimalist web app for saving money and reducing carbon footprint.
 * Features 9 journey types with real UK DEFRA emission calculations.
 * Works 100% offline with optional AI enhancements.
 */

import React, { useState, useCallback } from 'react';
import { IntroPage } from './components/IntroPage';
import { Homepage } from './components/Homepage';
import { ChatPage } from './components/ChatPage';
import { JourneyPage } from './components/JourneyPage';
import { ResultsPage } from './components/ResultsPage';
import { LikesPage } from './components/LikesPage';
import { SignupPopup } from './components/SignupPopup';
import { computeFootprint } from './utils/computeFootprint';
import { buildTips } from './utils/buildTips';
import { runJourney, saveJourneyResult, getJourneySpecificTips } from './logic';
import { getJourneyResults } from './services/api';
import { saveJourneyHistory } from './lib/neon';

export default function App() {
  // Navigation
  const [currentPage, setCurrentPage] = useState('intro');
  const [pageHistory, setPageHistory] = useState(['intro']);
  
  // Location (browser geolocation API)
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  
  // Journey tracking
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [journeyAnswers, setJourneyAnswers] = useState({});
  
  // Results
  const [footprintResult, setFootprintResult] = useState(null);
  const [tipsResult, setTipsResult] = useState([]);
  
  // Liked results (localStorage)
  const [likedResults, setLikedResults] = useState<Map<string, any>>(() => {
    try {
      const stored = localStorage.getItem('zz-liked-results');
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Map(Object.entries(parsed));
      }
    } catch (e) {
      console.error('Error loading liked results:', e);
    }
    return new Map();
  });

  // Signup popup
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const navigateToPage = useCallback((page, journey = null) => {
    setCurrentPage(page);
    setPageHistory(prev => [...prev, page]);
    if (journey) {
      setSelectedJourney(journey);
      setJourneyAnswers({});
    }
  }, []);

  const navigateBack = useCallback(() => {
    if (pageHistory.length > 1) {
      const newHistory = pageHistory.slice(0, -1);
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(previousPage);
      
      // If going back to homepage, clear journey state
      if (previousPage === 'homepage') {
        setSelectedJourney(null);
        setJourneyAnswers({});
        setFootprintResult(null);
        setTipsResult([]);
      }
    }
  }, [pageHistory]);

  const handleJourneyComplete = useCallback(async (answers) => {
    setJourneyAnswers(answers);
    
    if (selectedJourney === 'profile') {
      // Legacy profile journey
      const footprint = computeFootprint(answers);
      const tips = buildTips(answers, footprint, userLocation);
      setFootprintResult(footprint);
      setTipsResult(tips);
    } else if (selectedJourney) {
      // Modern journey system with API + local fallback
      try {
        // Try Worker API first
        const apiResult = await getJourneyResults(selectedJourney, answers);
        
        if (apiResult) {
          // Use API result
          setFootprintResult(apiResult);
          setTipsResult(apiResult.tips || []);
          
          // Save to history (localStorage or Neon)
          await saveJourneyHistory(selectedJourney, answers, apiResult);
        } else {
          // Fallback to local calculations
          const result = await runJourney(selectedJourney, answers);
          saveJourneyResult(selectedJourney, result);
          
          const enhancedTips = await getJourneySpecificTips(
            selectedJourney,
            answers,
            {
              carbonKg: result.carbonKg || result.carbonKgPerDay || 0,
              moneySaved: result.moneySaved || result.savingsPerMonthGBP || 0
            }
          );
          
          setFootprintResult(result);
          setTipsResult(enhancedTips.length > 0 ? enhancedTips : result.tips || []);
          
          // Save to history (localStorage or Neon)
          await saveJourneyHistory(selectedJourney, answers, result);
        }
      } catch (error) {
        console.error('Journey calculation error:', error);
        setFootprintResult(null);
        setTipsResult([]);
      }
    }
    
    setCurrentPage('results');
  }, [selectedJourney, userLocation]);

  const generateJourneyResults = (journey, answers) => {
    // Mock data for each journey type
    const baseResults = {
      travel: [
        {
          title: 'cheapest',
          provider: 'flixbus',
          price: '£25',
          carbon: '9kg co₂',
          rationale: 'slower but much cheaper than flying',
          cta: 'book',
          href: 'https://www.flixbus.com/'
        },
        {
          title: 'greenest',
          provider: 'eurostar',
          price: '£49',
          carbon: '2kg co₂',
          rationale: 'lowest-carbon option for this route',
          cta: 'book',
          href: 'https://www.eurostar.com/'
        },
        {
          title: 'best balance',
          provider: 'ryanair',
          price: '£60',
          carbon: '120kg co₂',
          rationale: 'faster but much higher emissions',
          cta: 'book',
          href: 'https://www.ryanair.com/'
        }
      ],
      switch: [
        {
          title: 'cheapest',
          provider: 'octopus go',
          price: '£85/mo',
          carbon: '',
          rationale: 'cheapest fixed tariff on market',
          cta: 'switch',
          href: 'https://octopus.energy/'
        },
        {
          title: 'greenest',
          provider: 'good energy',
          price: '£90/mo',
          carbon: '100% renewable',
          rationale: 'fully renewable power mix',
          cta: 'switch',
          href: 'https://www.goodenergy.co.uk/'
        },
        {
          title: 'best balance',
          provider: 'bulb',
          price: '£87/mo',
          carbon: '',
          rationale: 'good price + renewable mix',
          cta: 'switch',
          href: 'https://bulb.co.uk/'
        }
      ],
      food: [
        {
          title: 'cheapest',
          provider: 'aldi meal plan',
          price: '£35/wk',
          carbon: '',
          rationale: 'low-cost family shop',
          cta: 'shop',
          href: 'https://www.aldi.co.uk/'
        },
        {
          title: 'greenest',
          provider: 'vegbox local',
          price: '£42/wk',
          carbon: '',
          rationale: 'organic veg, local farms',
          cta: 'choose',
          href: 'https://www.riverford.co.uk/'
        },
        {
          title: 'best balance',
          provider: 'too good to go',
          price: '£4/meal',
          carbon: '',
          rationale: 'save food waste + money',
          cta: 'choose',
          href: 'https://www.toogoodtogo.com/'
        }
      ],
      home: [
        {
          title: 'cheapest',
          provider: 'led bulbs',
          price: 'save £60/yr',
          carbon: '',
          rationale: 'lowest upfront cost, instant saving',
          cta: 'buy',
          href: 'https://www.energysavingtrust.org.uk/'
        },
        {
          title: 'greenest',
          provider: 'loft insulation',
          price: 'save 400kg co₂/yr',
          carbon: '',
          rationale: 'highest carbon saving long-term',
          cta: 'install',
          href: 'https://www.energysavingtrust.org.uk/'
        },
        {
          title: 'best balance',
          provider: 'smart thermostat',
          price: 'save £120/yr',
          carbon: '',
          rationale: 'balance of savings + comfort',
          cta: 'install',
          href: 'https://nest.com/'
        }
      ],
      shop: [
        {
          title: 'cheapest',
          provider: 'primark t-shirt',
          price: '£4',
          carbon: '',
          rationale: 'lowest cost, but not sustainable',
          cta: 'buy',
          href: 'https://www.primark.com/'
        },
        {
          title: 'greenest',
          provider: 'patagonia',
          price: '£25',
          carbon: 'organic cotton',
          rationale: 'highest sustainability rating',
          cta: 'buy',
          href: 'https://www.patagonia.com/'
        },
        {
          title: 'best balance',
          provider: 'vinted second-hand',
          price: '£8',
          carbon: '',
          rationale: 'affordable + circular reuse',
          cta: 'buy',
          href: 'https://www.vinted.co.uk/'
        }
      ],
      waste: [
        {
          title: 'cheapest',
          provider: 'council bin service',
          price: 'free',
          carbon: '',
          rationale: 'included with council tax',
          cta: 'use',
          href: 'https://www.gov.uk/find-local-council'
        },
        {
          title: 'greenest',
          provider: 'home compost bin',
          price: '£40',
          carbon: '',
          rationale: 'lowest food waste footprint',
          cta: 'compost',
          href: 'https://www.rhs.org.uk/garden-jobs/compost'
        },
        {
          title: 'best balance',
          provider: 'olio food share app',
          price: 'free',
          carbon: '',
          rationale: 'free + prevents food waste',
          cta: 'join',
          href: 'https://olioex.com/'
        }
      ],
      holiday: [
        {
          title: 'cheapest',
          provider: 'local camping',
          price: '£25/night',
          carbon: '15kg co₂',
          rationale: 'stay local, camp under stars',
          cta: 'book',
          href: 'https://www.coolcamping.com/'
        },
        {
          title: 'greenest',
          provider: 'train adventure',
          price: '£180/trip',
          carbon: '8kg co₂',
          rationale: 'explore by rail, lowest emissions',
          cta: 'book',
          href: 'https://www.thetrainline.com/'
        },
        {
          title: 'best balance',
          provider: 'eco retreat',
          price: '£95/night',
          carbon: '45kg co₂',
          rationale: 'sustainable accommodation, regional travel',
          cta: 'book',
          href: 'https://www.ecobnb.com/'
        }
      ],
      money: [
        {
          title: 'cheapest',
          provider: 'octopus tracker',
          price: 'save £240/yr',
          carbon: '',
          rationale: 'lowest energy rates + green power',
          cta: 'switch',
          href: 'https://octopus.energy/'
        },
        {
          title: 'greenest',
          provider: 'ethical bank',
          price: '3.5% interest',
          carbon: '100% fossil-free',
          rationale: 'divest from fossil fuels, fund renewables',
          cta: 'switch',
          href: 'https://www.triodos.co.uk/'
        },
        {
          title: 'best balance',
          provider: 'moneyhelper tools',
          price: 'save £400/yr',
          carbon: '',
          rationale: 'budgeting + cashback + debt advice',
          cta: 'learn',
          href: 'https://www.moneyhelper.org.uk/'
        }
      ],
      health: [
        {
          title: 'cheapest',
          provider: 'walk instead',
          price: 'free',
          carbon: 'save 120kg co₂/yr',
          rationale: '30min daily walk = free fitness + lower footprint',
          cta: 'start',
          href: 'https://www.nhs.uk/live-well/exercise/walking-for-health/'
        },
        {
          title: 'greenest',
          provider: 'plant-based diet',
          price: 'save £60/mo',
          carbon: 'save 500kg co₂/yr',
          rationale: 'better health + biggest carbon win',
          cta: 'try',
          href: 'https://www.veganuary.com/'
        },
        {
          title: 'best balance',
          provider: 'digital detox',
          price: 'free',
          carbon: '',
          rationale: 'reduce screen time = better sleep + less energy use',
          cta: 'start',
          href: 'https://www.bbc.co.uk/programmes/articles/1KL6WTx8vJ6MvD4nfqlXMWQ/ten-tips-for-a-digital-detox'
        }
      ]
    };

    return baseResults[journey] || baseResults.travel;
  };

  const toggleLikeResult = useCallback((result) => {
    setLikedResults(prev => {
      const newLiked = new Map(prev);
      // Support both provider (for regular results) and category (for tips)
      const identifier = result.provider || result.category;
      const resultKey = `${result.title}-${identifier}`;
      
      if (newLiked.has(resultKey)) {
        newLiked.delete(resultKey);
      } else {
        newLiked.set(resultKey, result);
      }
      
      // Persist to localStorage
      try {
        const obj = Object.fromEntries(newLiked);
        localStorage.setItem('zz-liked-results', JSON.stringify(obj));
      } catch (e) {
        console.error('Error saving liked results:', e);
      }
      
      return newLiked;
    });
  }, []);

  const handleIntroComplete = useCallback(() => {
    if (!locationPermissionAsked && navigator.geolocation) {
      setLocationPermissionAsked(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        () => {
          // User denied or location unavailable
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 600000
        }
      );
    }
    
    navigateToPage('homepage');
  }, [locationPermissionAsked, navigateToPage]);

  const handleSignup = useCallback((method: string, value?: string) => {
    console.log('Signup:', method, value);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#000', color: '#fff' }}>
      {currentPage === 'intro' && (
        <IntroPage onComplete={handleIntroComplete} />
      )}
      
      {currentPage === 'homepage' && (
        <Homepage 
          onJourneySelect={(journey) => navigateToPage('journey', journey)}
          onChatSelect={() => navigateToPage('chat')}
          onIntroSelect={() => navigateToPage('intro')}
          onSignupClick={() => setIsSignupOpen(true)}
        />
      )}
      
      {currentPage === 'chat' && (
        <ChatPage 
          onJourneySelect={(journey) => navigateToPage('journey', journey)}
          onBack={navigateBack}
        />
      )}
      
      {currentPage === 'journey' && selectedJourney && (
        <JourneyPage 
          journey={selectedJourney}
          onComplete={handleJourneyComplete}
          onBack={navigateBack}
          onHome={() => navigateToPage('homepage')}
        />
      )}
      
      {currentPage === 'results' && (
        <ResultsPage 
          journey={selectedJourney}
          answers={journeyAnswers}
          footprintResult={footprintResult}
          tipsResult={tipsResult}
          likedResults={likedResults}
          onToggleLike={toggleLikeResult}
          onBack={navigateBack}
          onHome={() => navigateToPage('homepage')}
          onChat={() => navigateToPage('chat')}
          onLikes={() => navigateToPage('likes')}
          onJourneySelect={(journey) => navigateToPage('journey', journey)}
          onSignupClick={() => setIsSignupOpen(true)}
        />
      )}
      
      {currentPage === 'likes' && (
        <LikesPage 
          likedResults={likedResults}
          onToggleLike={toggleLikeResult}
          onBack={navigateBack}
          onHome={() => navigateToPage('homepage')}
          onChat={() => navigateToPage('chat')}
        />
      )}

      {/* Global Signup Popup */}
      <SignupPopup 
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSignup={handleSignup}
      />
    </div>
  );
}