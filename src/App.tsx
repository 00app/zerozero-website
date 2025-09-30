/**
 * Zero Zero - Main Application
 * 
 * A minimalist web app for saving money and reducing carbon footprint.
 * All external APIs are mocked via utils/codeWordAPI.ts for deployment-ready standalone operation.
 * 
 * State management is centralized here and passed down via props.
 * 
 * For API integration, see: API_INTEGRATION_GUIDE.md
 * For deployment, see: DEPLOYMENT.md
 */

import React, { useState } from 'react';
import { IntroPage } from './components/IntroPage';
import { Homepage } from './components/Homepage';
import { ChatPage } from './components/ChatPage';
import { JourneyPage } from './components/JourneyPage';
import { ResultsPage } from './components/ResultsPage';
import { LikesPage } from './components/LikesPage';
import { computeFootprint } from './utils/computeFootprint';
import { buildTips } from './utils/buildTips';

export default function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('intro');
  const [pageHistory, setPageHistory] = useState(['intro']);
  
  // Location state - browser geolocation, no API needed
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  
  // Journey state - tracks user's current journey and answers
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [journeyAnswers, setJourneyAnswers] = useState({});
  
  // Results state - computed footprint and personalized tips
  const [footprintResult, setFootprintResult] = useState(null);
  const [tipsResult, setTipsResult] = useState([]);
  
  // Saved results - stored in localStorage (TODO: migrate to codeWordAPI_saveLikedResult)
  const [likedResults, setLikedResults] = useState(new Set());
  const [allResults, setAllResults] = useState([]);

  const navigateToPage = (page, journey = null) => {
    setCurrentPage(page);
    setPageHistory(prev => [...prev, page]);
    if (journey) {
      setSelectedJourney(journey);
      setJourneyAnswers({});
    }
  };

  const navigateBack = () => {
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
  };

  /**
   * Handle journey completion and generate results
   * 
   * For 'profile' journey: Computes carbon footprint + personalized tips
   * For other journeys: Generates comparison results (cheapest/greenest/best balance)
   * 
   * TODO: Replace generateJourneyResults with codeWordAPI calls:
   * - Travel: codeWordAPI_searchFlights, codeWordAPI_searchTrains, codeWordAPI_searchCoaches
   * - Switch: codeWordAPI_compareEnergyTariffs
   * - Food/Home/Shop/Waste: Custom recommendation APIs
   */
  const handleJourneyComplete = (answers) => {
    setJourneyAnswers(answers);
    
    // If this is the profile journey, compute footprint and tips
    if (selectedJourney === 'profile') {
      const footprint = computeFootprint(answers);
      const tips = buildTips(answers, footprint, userLocation);
      setFootprintResult(footprint);
      setTipsResult(tips);
      // Store tips as results for likes functionality
      if (tips && tips.length > 0) {
        setAllResults(prev => {
          const newResults = tips.map(tip => ({
            title: tip.title,
            provider: tip.category,
            price: `£${tip.estMoneyPerYear}/yr`,
            carbon: `${tip.estCo2ePerYear} kg CO₂e/yr`,
            rationale: tip.body,
            cta: 'learn more',
            href: 'https://www.instagram.com/percyzerozero/'
          }));
          return [...prev.filter(r => !tips.some(t => `${t.title}-${t.category}` === `${r.title}-${r.provider}`)), ...newResults];
        });
      }
    } else {
      // Generate results for other journey types and store them
      const results = generateJourneyResults(selectedJourney, answers);
      setAllResults(prev => {
        const filtered = prev.filter(r => !results.some(nr => `${nr.title}-${nr.provider}` === `${r.title}-${r.provider}`));
        return [...filtered, ...results];
      });
    }
    
    setCurrentPage('results');
  };

  /**
   * Generate mock comparison results for journeys
   * 
   * TODO: Replace with real API calls via codeWordAPI:
   * - travel: codeWordAPI_searchFlights + codeWordAPI_searchTrains + codeWordAPI_searchCoaches
   * - switch: codeWordAPI_compareEnergyTariffs
   * - food/home/shop/waste: Custom recommendation engines
   */
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
      ]
    };

    return baseResults[journey] || baseResults.travel;
  };

  /**
   * Toggle like/save for a result
   * Currently uses in-memory Set, lost on refresh
   * 
   * TODO: Replace with codeWordAPI_saveLikedResult / codeWordAPI_removeLikedResult
   * to persist to Supabase database
   */
  const toggleLikeResult = (result) => {
    setLikedResults(prev => {
      const newLiked = new Set(prev);
      const resultKey = `${result.title}-${result.provider}`;
      if (newLiked.has(resultKey)) {
        newLiked.delete(resultKey);
      } else {
        newLiked.add(resultKey);
      }
      return newLiked;
    });
  };

  const handleIntroComplete = () => {
    // Request location permission directly using browser's native dialog
    if (!locationPermissionAsked && navigator.geolocation) {
      setLocationPermissionAsked(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          // TODO: Call codeWordAPI_getUserLocation for reverse geocoding
        },
        () => {
          // TODO: Call codeWordAPI_getCountryFromIP for IP-based fallback
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 600000 // 10 minutes cache
        }
      );
    }
    
    // Navigate to homepage regardless of location permission outcome
    navigateToPage('homepage');
  };

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
        />
      )}
      
      {currentPage === 'likes' && (
        <LikesPage 
          likedResults={likedResults}
          allResults={allResults}
          onToggleLike={toggleLikeResult}
          onBack={navigateBack}
          onHome={() => navigateToPage('homepage')}
          onChat={() => navigateToPage('chat')}
        />
      )}
    </div>
  );
}