import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Share } from 'lucide-react';

interface ResultsPageProps {
  journey: string;
  answers: any;
  footprintResult?: any;
  tipsResult?: any[];
  likedResults: Set<string>;
  onToggleLike: (result: any) => void;
  onBack: () => void;
  onHome: () => void;
  onChat?: () => void;
  onLikes?: () => void;
}

export function ResultsPage({ journey, answers, footprintResult, tipsResult, likedResults, onToggleLike, onBack, onHome, onChat, onLikes }: ResultsPageProps) {
  const [visibleCards, setVisibleCards] = useState(0);

  const handleShare = async (item?: any) => {
    const shareData = {
      title: item?.title ? `${journey} result: ${item.title}` : `Zero Zero - ${journey} results`,
      text: item?.rationale || `Check out these ${journey} results from Zero Zero!`,
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

  useEffect(() => {
    // Staggered card animation: 0ms / 120ms / 240ms
    const timers = [0, 120, 240].map((delay, index) => 
      setTimeout(() => setVisibleCards(prev => Math.max(prev, index + 1)), delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const generateResults = () => {
    // Dynamic holiday results based on user answers
    const generateHolidayResults = () => {
      const isEcoFriendly = answers.ecoFriendly === 'yes';
      const distance = answers.distance || 0;
      const transport = answers.transport || 'car';
      const duration = answers.duration || 7;
      
      // Calculate rough CO2 estimates based on distance and transport
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
      ]
    };

    return baseResults[journey] || baseResults.travel;
  };

  const results = generateResults();

  // Profile journey gets special treatment
  if (journey === 'profile' && footprintResult && tipsResult) {
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
          <h4 className="fade-in px-5 text-[20px]">your annual footprint</h4>
        </div>

        {/* Footprint Overview */}
        <div className="flex-1 px-8 pb-8">
          <div className="w-full max-w-4xl mx-auto space-y-8">
            
            {/* Big Total */}
            <div className="text-center mb-12">
              <div className="text-[80px] font-extrabold text-white">
                {(footprintResult.total / 1000).toFixed(1)} tCO₂e
              </div>
              <p className="text-[20px] font-bold text-white/60">
                tonnes of carbon dioxide equivalent per year
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-4 mb-12">
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
                        style={{ 
                          width: `${(item.value / footprintResult.total) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-[20px] font-bold w-20 text-right">
                      {item.value} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Savings Panel */}
            {tipsResult.length > 0 && (
              <div className="bg-white/5 rounded-[40px] p-8 mb-8">
                <h3 className="text-[40px] font-extrabold mb-6">potential savings</h3>
                <div className="flex items-center gap-8 mb-6">
                  <div>
                    <div className="text-[40px] font-extrabold text-white">
                      £{tipsResult.reduce((sum, tip) => sum + tip.estMoneyPerYear, 0)}
                    </div>
                    <div className="text-[20px] font-bold text-white/60">per year</div>
                  </div>
                  <div>
                    <div className="text-[40px] font-extrabold text-white">
                      {Math.round(tipsResult.reduce((sum, tip) => sum + tip.estCo2ePerYear, 0) / 1000 * 10) / 10} tCO₂e
                    </div>
                    <div className="text-[20px] font-bold text-white/60">less carbon</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips List */}
            <div className="space-y-4">
              <h3 className="text-[40px] font-extrabold mb-6">your tips</h3>
              {tipsResult.map((tip, index) => (
                <Card key={tip.id} className="bg-white/5 border-none">
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
                            // Solid heart for liked state
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          ) : (
                            // Outline heart for default state
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Follow Button */}
            <div className="text-center mb-[120px]">
              <a
                href="https://www.instagram.com/percyzerozero/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-80 btn-primary text-[20px] font-bold uppercase">
                  follow
                </button>
              </a>
            </div>
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

        {/* Likes Button - Bottom Right */}
        {onLikes && (
          <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50 }}>
            <button
              onClick={onLikes}
              className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
              aria-label="Likes"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
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
        )}

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
        <h4 className="text-[40px] font-extrabold uppercase text-white">{journey} results</h4>
      </div>

      {/* Results */}
      <div className="flex-1 flex items-center justify-center px-4 lg:px-10">
        <div className="w-full max-w-6xl">
          <div className="space-y-8">
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
                        aria-label={likedResults.has(`${result.title}-${result.provider}`) ? "Unlike result" : "Like result"}
                      >
                        {likedResults.has(`${result.title}-${result.provider}`) ? (
                          // Solid heart for liked state
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        ) : (
                          // Outline heart for default state
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

          {/* Footer */}
          <div className="text-center mt-16">
            <p className="text-[16px] font-bold text-white/60 mb-8">
              results based on your preferences and current market data
            </p>
          </div>
        </div>
      </div>

      {/* Follow Button */}
      <div className="text-center mb-[120px]">
        <a
          href="https://www.instagram.com/percyzerozero/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="btn-80 btn-primary text-[20px] font-bold uppercase">
            follow
          </button>
        </a>
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

      {/* Likes Button - Bottom Right */}
      {onLikes && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50 }}>
          <button
            onClick={onLikes}
            className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
            aria-label="Likes"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
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
      )}

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