import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Share, Heart, Send, MessageCircle, Car, Plug, UtensilsCrossed, Home, ShoppingBag, Recycle, Tent, Banknote, HeartPulse, UserPlus } from 'lucide-react';
import { LikesPopup } from './LikesPopup';

interface ResultsPageProps {
  journey: string;
  answers: any;
  footprintResult?: any;
  tipsResult?: any[];
  likedResults: Map<string, any>;
  onToggleLike: (result: any) => void;
  onBack: () => void;
  onHome: () => void;
  onChat?: () => void;
  onLikes?: () => void;
  onJourneySelect?: (journey: string) => void;
  onSignupClick?: () => void;
}

export function ResultsPage({ journey, answers, footprintResult, tipsResult, likedResults, onToggleLike, onBack, onHome, onChat, onLikes, onJourneySelect, onSignupClick }: ResultsPageProps) {
  const [visibleCards, setVisibleCards] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [showLikesPopup, setShowLikesPopup] = useState(false);

  // Journey icon data - matching Homepage exactly
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

  const handleShare = async (item?: any) => {
    const shareData = {
      title: item?.title ? `${journey} impact: ${item.title}` : `Zero Zero - ${journey} IMPACT`,
      text: item?.rationale || `Check out these ${journey} impact results from Zero Zero!`,
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

  useEffect(() => {
    const timers = [0, 120, 240].map((delay, index) => 
      setTimeout(() => setVisibleCards(prev => Math.max(prev, index + 1)), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Hero Impact Data per journey
  const getHeroImpact = () => {
    const impacts = {
      travel: { carbon: '38kg co₂', money: '£72 saved', improvement: '+25%', equivalent: '100 trees' },
      switch: { carbon: '2.8t co₂', money: '£240 saved', improvement: '+35%', equivalent: '8yr fridge' },
      food: { carbon: '520kg co₂', money: '£84 saved', improvement: '+30%', equivalent: '50 trips' },
      home: { carbon: '850kg co₂', money: '£320 saved', improvement: '+40%', equivalent: '40 trees' },
      shop: { carbon: '1.2t co₂', money: '£100 saved', improvement: '+50%', equivalent: '100 shirts' },
      waste: { carbon: '450kg co₂', money: '£40 saved', improvement: '+60%', equivalent: '6 bins/wk' },
      holiday: { carbon: '120kg co₂', money: '£560 saved', improvement: '+70%', equivalent: '2mo drive' },
      money: { carbon: '£450 saved', money: '3.5% apy', improvement: '£120/mo', equivalent: '1wk salary' },
      health: { carbon: '120kg co₂', money: 'free', improvement: '+30min', equivalent: '1 marathon' }
    };
    return impacts[journey] || impacts.travel;
  };

  // Actionable Tips Data per journey
  const getActionableTips = () => {
    const tips = {
      travel: [
        { id: '1', label: 'cycle short trips', impact: 'save £40 / mo', link: 'https://www.sustrans.org.uk', type: 'tip' },
        { id: '2', label: 'get a railcard', impact: '-150kg co₂ / yr', link: 'https://www.railcard.co.uk', type: 'offer' },
        { id: '3', label: 'share rides', impact: 'save £40 / mo', link: 'https://www.blablacar.co.uk', type: 'recommendation' },
        { id: '4', label: 'walk more', impact: '-200kg co₂ / yr', link: 'https://www.livingstreets.org.uk', type: 'tip' },
        { id: '5', label: 'try the bus', impact: 'save £60 / mo', link: 'https://www.nationalexpress.com', type: 'offer' },
        { id: '6', label: 'go electric', impact: '-90% emissions', link: 'https://www.nextgreencar.com', type: 'recommendation' }
      ],
      switch: [
        { id: '1', label: 'led bulbs', impact: 'save £60 / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'tip' },
        { id: '2', label: 'smart thermostat', impact: 'save £120 / yr', link: 'https://nest.com/', type: 'offer' },
        { id: '3', label: 'loft insulation', impact: '-400kg co₂ / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'recommendation' },
        { id: '4', label: 'solar panels', impact: 'save £300 / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'tip' },
        { id: '5', label: 'lower heating', impact: 'save £80 / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'offer' },
        { id: '6', label: 'draught proof', impact: '-100kg co₂ / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'recommendation' }
      ],
      food: [
        { id: '1', label: 'local vegbox', impact: '-200kg co₂ / yr', link: 'https://www.riverford.co.uk/', type: 'tip' },
        { id: '2', label: 'too good to go', impact: 'save £50 / mo', link: 'https://www.toogoodtogo.com/', type: 'offer' },
        { id: '3', label: 'plan meals', impact: 'cut waste 40%', link: 'https://www.lovefoodhatewaste.com/', type: 'recommendation' },
        { id: '4', label: 'plant meals', impact: '-300kg co₂ / yr', link: 'https://www.veganuary.com/', type: 'tip' },
        { id: '5', label: 'batch cook', impact: 'save £25 / mo', link: 'https://www.bbcgoodfood.com', type: 'offer' },
        { id: '6', label: 'buy local', impact: 'support farms', link: 'https://www.farmdrop.com', type: 'recommendation' }
      ],
      home: [
        { id: '1', label: 'draught proof', impact: '-100kg co₂ / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'tip' },
        { id: '2', label: 'lower heating', impact: 'save £80 / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'offer' },
        { id: '3', label: 'short showers', impact: 'save £70 / yr', link: 'https://www.waterwise.org.uk/', type: 'recommendation' },
        { id: '4', label: 'unplug standby', impact: 'save £35 / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'tip' },
        { id: '5', label: 'wash at 30°c', impact: 'save £28 / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'offer' },
        { id: '6', label: 'bleed radiators', impact: 'save £60 / yr', link: 'https://www.energysavingtrust.org.uk/', type: 'recommendation' }
      ],
      shop: [
        { id: '1', label: 'second-hand', impact: 'save 80% carbon', link: 'https://www.vinted.co.uk/', type: 'tip' },
        { id: '2', label: 'repair first', impact: 'extend life 5x', link: 'https://www.ifixit.com/', type: 'offer' },
        { id: '3', label: 'ethical brands', impact: 'fair wages', link: 'https://www.goodonyou.eco/', type: 'recommendation' },
        { id: '4', label: 'buy local', impact: 'support local', link: 'https://www.localgiving.org/', type: 'tip' },
        { id: '5', label: 'clothing swaps', impact: 'free clothes', link: 'https://www.swishing.org', type: 'offer' },
        { id: '6', label: 'rent occasion', impact: 'save £100s', link: 'https://www.hurr.com', type: 'recommendation' }
      ],
      waste: [
        { id: '1', label: 'start compost', impact: '-150kg / yr', link: 'https://www.rhs.org.uk/garden-jobs/compost', type: 'tip' },
        { id: '2', label: 'share via olio', impact: 'stop waste', link: 'https://olioex.com/', type: 'offer' },
        { id: '3', label: 'recycle right', impact: 'boost rate', link: 'https://www.recyclenow.com/', type: 'recommendation' },
        { id: '4', label: 'refill stations', impact: 'cut plastic', link: 'https://www.refill.org.uk/', type: 'tip' },
        { id: '5', label: 'repair cafe', impact: 'fix not bin', link: 'https://www.repaircafe.org', type: 'offer' },
        { id: '6', label: 'donate items', impact: 'help others', link: 'https://www.freecycle.org', type: 'recommendation' }
      ],
      holiday: [
        { id: '1', label: 'train travel', impact: '-90% emissions', link: 'https://www.thetrainline.com/', type: 'tip' },
        { id: '2', label: 'explore local', impact: 'save £600', link: 'https://www.coolcamping.com/', type: 'offer' },
        { id: '3', label: 'eco hotels', impact: 'green stays', link: 'https://www.ecobnb.com/', type: 'recommendation' },
        { id: '4', label: 'offset flights', impact: 'balance co₂', link: 'https://www.goldstandard.org', type: 'tip' },
        { id: '5', label: 'uk staycation', impact: 'save £400', link: 'https://www.visitbritain.com', type: 'offer' },
        { id: '6', label: 'cycle tours', impact: 'free fitness', link: 'https://www.cyclinguk.org', type: 'recommendation' }
      ],
      money: [
        { id: '1', label: 'ethical bank', impact: 'divest fossil', link: 'https://www.triodos.co.uk/', type: 'tip' },
        { id: '2', label: 'budget tools', impact: 'save £150 / mo', link: 'https://www.moneyhelper.org.uk/', type: 'offer' },
        { id: '3', label: 'cashback cards', impact: 'earn 1-3%', link: 'https://www.moneysavingexpert.com/', type: 'recommendation' },
        { id: '4', label: 'compare bills', impact: 'save £300 / yr', link: 'https://www.moneysupermarket.com/', type: 'tip' },
        { id: '5', label: 'green pension', impact: 'divest fossil', link: 'https://www.makemymoneymatter.co.uk', type: 'offer' },
        { id: '6', label: 'high interest', impact: 'earn more', link: 'https://www.moneysavingexpert.com', type: 'recommendation' }
      ],
      health: [
        { id: '1', label: 'walk daily', impact: 'boost mood', link: 'https://www.nhs.uk/live-well/exercise/walking-for-health/', type: 'tip' },
        { id: '2', label: 'plant meals', impact: '-500kg co₂ / yr', link: 'https://www.veganuary.com/', type: 'offer' },
        { id: '3', label: 'screen detox', impact: 'better sleep', link: 'https://www.bbc.co.uk/programmes/articles/1KL6WTx8vJ6MvD4nfqlXMWQ/ten-tips-for-a-digital-detox', type: 'recommendation' },
        { id: '4', label: 'cycle work', impact: 'save £80 / mo', link: 'https://www.cyclinguk.org/', type: 'tip' },
        { id: '5', label: 'free yoga', impact: 'cut stress', link: 'https://www.nhs.uk/conditions/nhs-fitness-studio/', type: 'offer' },
        { id: '6', label: 'better sleep', impact: 'save energy', link: 'https://www.sleepfoundation.org', type: 'recommendation' }
      ]
    };
    return tips[journey] || tips.travel;
  };

  // Zai Quick-start Questions per journey
  const getZaiQuestions = () => {
    const questions = {
      travel: ['commute', 'ev costs', 'fuel tips'],
      switch: ['tariff', 'solar', 'grants'],
      food: ['cut bills', 'reduce waste', 'healthy'],
      home: ['quick wins', 'grants', 'heat pump'],
      shop: ['second-hand', 'repair', 'ethical'],
      waste: ['waste cut', 'compost', 'recycle'],
      holiday: ['train', 'uk breaks', 'offset'],
      money: ['savings', 'banks', 'cut bills'],
      health: ['fitness', 'plant diet', 'sleep']
    };
    return questions[journey] || questions.travel;
  };

  const generateResults = () => {
    const generateHolidayResults = () => {
      const isEcoFriendly = answers.ecoFriendly === 'yes';
      const distance = answers.distance || 0;
      const transport = answers.transport || 'car';
      const duration = answers.duration || 7;
      
      const getCO2Estimate = (transportType: string, km: number) => {
        const factors = {
          'train': 0.04,
          'car': 0.2,
          'flight': 0.25,
          'coach': 0.08,
          'ferry': 0.12
        };
        return Math.round((factors[transportType] || 0.2) * km);
      };

      const baseCO2 = getCO2Estimate(transport, distance);
      const basePrice = Math.round(50 + (distance * 0.1) + (duration * 20));

      if (isEcoFriendly) {
        return [
          {
            title: 'greenest choice',
            provider: 'eco farm stay',
            price: `£${Math.round(basePrice * 0.7)}/trip`,
            carbon: `${Math.round(baseCO2 * 0.3)}kg co₂`,
            rationale: 'you\'ve made a low-impact choice!',
            cta: 'book',
            href: 'https://www.farmstay.co.uk/'
          },
          {
            title: 'local retreat',
            provider: 'mindful getaway',
            price: `£${Math.round(basePrice * 0.9)}/trip`,
            carbon: `${Math.round(baseCO2 * 0.5)}kg co₂`,
            rationale: 'close to home, gentle on planet',
            cta: 'book',
            href: 'https://www.booking.com/'
          },
          {
            title: 'train adventure',
            provider: 'rail holidays',
            price: `£${Math.round(basePrice * 1.1)}/trip`,
            carbon: `${Math.round(baseCO2 * 0.2)}kg co₂`,
            rationale: 'scenic routes, minimal emissions',
            cta: 'book',
            href: 'https://www.thetrainline.com/'
          }
        ];
      } else {
        return [
          {
            title: 'cheapest',
            provider: 'budget booking',
            price: `£${Math.round(basePrice * 0.6)}/trip`,
            carbon: `${baseCO2}kg co₂`,
            rationale: 'lowest cost option found',
            cta: 'book',
            href: 'https://www.booking.com/'
          },
          {
            title: 'greenest',
            provider: 'eco hotel',
            price: `£${Math.round(basePrice * 1.3)}/trip`,
            carbon: `${Math.round(baseCO2 * 0.4)}kg co₂`,
            rationale: 'offset included, sustainable practices',
            cta: 'book',
            href: 'https://www.ecobnb.com/'
          },
          {
            title: 'best balance',
            provider: 'mid-range stay',
            price: `£${basePrice}/trip`,
            carbon: `${Math.round(baseCO2 * 0.8)}kg co₂`,
            rationale: 'good value, some eco features',
            cta: 'book',
            href: 'https://www.airbnb.com/'
          }
        ];
      }
    };

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
      holiday: journey === 'holiday' ? generateHolidayResults() : [
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

  const results = generateResults();
  const heroImpact = getHeroImpact();
  const actionableTips = getActionableTips();
  const zaiQuestions = getZaiQuestions();

  // Profile journey gets special treatment
  if (journey === 'profile' && footprintResult && tipsResult) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        {/* Header */}
        <div className="pt-8 md:pt-12 pb-6 text-center">
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
          <h4 className="fade-in px-5 text-[20px]">your annual footprint</h4>
        </div>

        <div className="flex-1 px-8 pb-8">
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="text-[80px] font-extrabold text-white">
                {(footprintResult.total / 1000).toFixed(1)} tCO₂e
              </div>
              <p className="text-[20px] font-bold text-white/60">
                tonnes of carbon dioxide equivalent per year
              </p>
            </div>

            <div className="space-y-4 mb-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              {[
                { label: 'home', value: footprintResult.home.co2e, color: '#fff' },
                { label: 'travel', value: footprintResult.travel.co2e, color: '#fff' },
                { label: 'food', value: footprintResult.food.co2e, color: '#fff' },
                { label: 'shopping', value: footprintResult.shopping.co2e, color: '#fff' },
                { label: 'waste', value: footprintResult.waste.co2e, color: '#fff' }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <span className="text-[20px] font-bold text-white uppercase">{item.label}</span>
                  <div className="flex items-center gap-4 flex-1 mx-8">
                    <div className="flex-1 h-2 bg-white/20 rounded-full">
                      <div 
                        className="h-2 bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${(item.value / footprintResult.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-[20px] font-bold w-20 text-right">
                      {item.value} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {tipsResult.length > 0 && (
              <div className="bg-white/5 rounded-[40px] p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <h3 className="text-[32px] font-extrabold mb-6">potential savings</h3>
                <div className="flex items-center gap-8 mb-6">
                  <div>
                    <div className="text-[32px] font-extrabold text-white">
                      £{tipsResult.reduce((sum, tip) => sum + tip.estMoneyPerYear, 0)}
                    </div>
                    <div className="text-[20px] font-bold text-white/60">per year</div>
                  </div>
                  <div>
                    <div className="text-[32px] font-extrabold text-white">
                      {Math.round(tipsResult.reduce((sum, tip) => sum + tip.estCo2ePerYear, 0) / 1000 * 10) / 10} tCO₂e
                    </div>
                    <div className="text-[20px] font-bold text-white/60">less carbon</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-[32px] font-extrabold mb-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>your tips</h3>
              {tipsResult.map((tip, index) => (
                <Card 
                  key={tip.id} 
                  className="bg-white/5 border-none animate-fade-in-up"
                  style={{ animationDelay: `${1000 + (index * 150)}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-[16px] font-bold uppercase">{tip.category}</span>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleShare(tip)}
                          className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-200"
                          aria-label="Share result"
                        >
                          <Share size={20} />
                        </button>
                        <button 
                          onClick={() => onToggleLike(tip)}
                          className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-200"
                          aria-label={likedResults.has(`${tip.title}-${tip.category}`) ? "Unlike tip" : "Like tip"}
                        >
                          {likedResults.has(`${tip.title}-${tip.category}`) ? (
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
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[20px] font-bold">{tip.title}</h4>
                      <p className="text-[16px] font-bold text-white/80">{tip.body}</p>
                      <div className="flex items-center gap-6 text-[16px] font-bold text-white/60">
                        <span>save £{tip.estMoneyPerYear}/yr</span>
                        <span>save {tip.estCo2ePerYear} kg CO₂e/yr</span>
                      </div>
                      <div className="pt-2">
                        <a
                          href="https://www.instagram.com/percyzerozero/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="bg-white text-black font-bold uppercase px-6 py-2 rounded-full text-[16px] hover:bg-white/90 transition-colors duration-200">
                            learn more
                          </button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
                  <UserPlus size={24} strokeWidth={1.5} />
                </button>
              </a>
            </div>
          </div>
        </div>

        {onChat && (
          <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 50 }}>
            <button
              onClick={onChat}
              className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
              aria-label="Chat with Zai"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        )}

        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50 }}>
          <button
            onClick={() => setShowLikesPopup(true)}
            className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
            aria-label="Open likes"
          >
            {likedResults.size > 0 ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            )}
          </button>
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

        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
          <button 
            onClick={onHome}
            className="btn-80 btn-primary uppercase"
          >
            home
          </button>
        </div>

        {/* Likes Popup */}
        <LikesPopup
          isOpen={showLikesPopup}
          onClose={() => setShowLikesPopup(false)}
          likedResults={likedResults}
          onToggleLike={onToggleLike}
        />
      </div>
    );
  }

  // Regular journey results page with all new sections
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="pt-8 md:pt-12 pb-6 text-center">
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
        
        {/* Journey Title */}
        <h4 className="text-[28px] font-extrabold uppercase text-white mb-8">{journey} IMPACT</h4>

        {/* 1. Hero Impact Section */}
        <div className="grid grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto px-6 lg:px-10 pb-8">
          {[
            { value: heroImpact.carbon, label: "carbon impact" },
            { value: heroImpact.money, label: "money saved" },
            { value: heroImpact.improvement, label: "% improvement" },
            { value: heroImpact.equivalent, label: "equivalent" }
          ].map((metric) => (
            <div key={metric.label} className="p-6 lg:p-10 bg-transparent flex flex-col items-start text-left">
              <h4 className="text-[28px] lg:text-[32px] font-extrabold leading-none mb-2 text-white">{metric.value}</h4>
              <p className="text-[14px] lg:text-[16px] font-bold text-white/80 tracking-wide">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 px-4 lg:px-10 pb-32">
        <div className="w-full max-w-6xl mx-auto">
          
          {/* 2. Journey Outcomes - Keep exactly as is */}
          <h4 className="text-[28px] font-extrabold uppercase mb-8 text-center">CHOICE SMARTER</h4>
          <div className="space-y-8 mb-16">
            {results.map((result, index) => (
              <div 
                key={result.title}
                className={`bg-white/5 rounded-2xl transition-all duration-500 transform ${
                  visibleCards > index 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="p-6 lg:p-10">
                  <div className="flex flex-col">
                    <h4 className="font-extrabold uppercase leading-none mb-4 text-white">
                      {result.title}
                    </h4>
                    
                    <p className="text-[16px] lg:text-[20px] font-bold mb-6 text-white">
                      {result.provider}
                    </p>
                    
                    <div className="flex items-baseline gap-8 mb-6">
                      <span className="text-[28px] lg:text-[28px] font-bold text-white">
                        {result.price}
                      </span>
                      {result.carbon && (
                        <span className="text-[18px] lg:text-[24px] font-bold text-white/60">
                          {result.carbon}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[14px] lg:text-[16px] font-bold text-white/80 mb-6">
                      {result.rationale}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <a href={result.href} target="_blank" rel="noopener nofollow sponsored">
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
                        aria-label={likedResults.has(`${result.title}-${result.provider}`) ? "Unlike result" : "Like result"}
                      >
                        {likedResults.has(`${result.title}-${result.provider}`) ? (
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
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Actionable Tips - Two-column grid */}
          <div className="mb-16">
            <h4 className="text-[28px] font-extrabold uppercase mb-8 text-center">better choices</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {actionableTips.map((tip) => (
                <div key={tip.id} className="p-6 lg:p-10 bg-white/5 rounded-2xl flex flex-col justify-between">
                  <div className="flex flex-col mb-6">
                    <p className="text-[20px] lg:text-[24px] font-extrabold text-white mb-3 leading-tight uppercase">
                      {tip.label}
                    </p>
                    <p className="text-[16px] lg:text-[18px] font-bold text-white/80">
                      {tip.impact}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    <a href={tip.link} target="_blank" rel="noopener noreferrer">
                      <button className="bg-white text-black font-bold uppercase px-6 py-2 rounded-full text-[16px] hover:bg-white/90 transition-colors duration-200">
                        {tip.type === 'offer' ? 'SEE OFFER' : 'LEARN MORE'}
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
                      onClick={() =>
                        onToggleLike({
                          title: tip.label,
                          provider: journey,
                          price: tip.impact,
                          carbon: '',
                          rationale: tip.impact,
                          cta: 'visit',
                          href: tip.link,
                        })
                      }
                      className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
                      aria-label={likedResults.has(`${tip.label}-${journey}`) ? 'Unlike tip' : 'Like tip'}
                    >
                      {likedResults.has(`${tip.label}-${journey}`) ? (
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
                </div>
              ))}
            </div>
          </div>

          {/* 4. Zai Chat Section */}
          <div className="mb-16">
            <h4 className="text-[28px] font-extrabold uppercase mb-6 text-center">ask zai</h4>
            
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {zaiQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setChatInput(question);
                    if (onChat) onChat();
                  }}
                  className="pill btn-secondary text-[14px] min-h-[40px] px-5 uppercase"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInput.trim() && onChat) {
                    onChat();
                  }
                }}
                placeholder="ask zai anything..."
                className="w-full bg-white text-black rounded-full px-6 py-3 pr-24 text-[16px] font-bold"
              />
              <button
                onClick={() => {
                  if (chatInput.trim() && onChat) onChat();
                }}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white text-black border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
                aria-label="Save response"
              >
                <Heart size={16} />
              </button>
              <button
                onClick={() => {
                  if (chatInput.trim() && onChat) onChat();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-200"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* 5. Journey Buttons - Identical to Homepage */}
          {onJourneySelect && (
            <div className="text-center mb-16">
              <div className="grid grid-cols-3 gap-4 mb-8 w-[264px] mx-auto">
                {mainJourneys.map((journeyItem) => {
                  const Icon = journeyItem.icon;
                  return (
                    <button
                      key={journeyItem.id}
                      onClick={() => onJourneySelect(journeyItem.id)}
                      title={journeyItem.tooltip}
                      className="btn-80 btn-primary flex-col gap-1"
                    >
                      <Icon size={20} strokeWidth={1.5} />
                      <span className="text-[10px] font-bold uppercase">{journeyItem.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Start New Journey Button */}
              <button
                onClick={onHome}
                className="pill btn-secondary w-full max-w-md"
              >
                START NEW JOURNEY
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mb-16">
            <p className="text-[16px] font-bold text-white/60">
              results based on your preferences and current market data
            </p>
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
                <UserPlus size={24} strokeWidth={1.5} />
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      {onChat && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 50 }}>
          <button
            onClick={onChat}
            className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
            aria-label="Chat with Zai"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      )}

      {/* Signup Button - Top Right */}
      {onSignupClick && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50 }}>
          <button
            onClick={onSignupClick}
            className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
            aria-label="Sign up for more tips"
          >
            <UserPlus size={20} />
          </button>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50 }}>
        <button
          onClick={() => setShowLikesPopup(true)}
          className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
          aria-label="Open likes"
        >
          {likedResults.size > 0 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          )}
        </button>
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

      {/* Likes Popup */}
      <LikesPopup
        isOpen={showLikesPopup}
        onClose={() => setShowLikesPopup(false)}
        likedResults={likedResults}
        onToggleLike={onToggleLike}
      />
    </div>
  );
}
