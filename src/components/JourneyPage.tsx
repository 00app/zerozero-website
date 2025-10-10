import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { PillChoices } from './PillChoices';

interface Question {
  text: string;
  type: 'text' | 'number' | 'date' | 'slider' | 'pills';
  key: string;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
  placeholder?: string;
  condition?: (answers: any) => boolean;
}

interface JourneyPageProps {
  journey: string;
  onComplete: (answers: any) => void;
  onBack: () => void;
  onHome?: () => void;
}

const journeyQuestions = {
  travel: [
    { text: 'start location?', type: 'text', key: 'from' },
    { text: 'destination?', type: 'text', key: 'to' },
    { text: 'travel date?', type: 'date', key: 'date' },
    { text: 'travel group size?', type: 'pills', key: 'people', options: ['1', '2', '3', '4', '5', '6+'] },
    { text: 'priority?', type: 'pills', key: 'priority', options: ['cost', 'speed', 'carbon'] },
    { text: 'return trip?', type: 'pills', key: 'return', options: ['yes', 'no'] }
  ],
  switch: [
    { text: 'energy provider?', type: 'text', key: 'provider' },
    { text: 'energy tariff?', type: 'pills', key: 'tariff', options: ['fixed', 'variable'] },
    { text: 'monthly cost?', type: 'pills', key: 'monthly', options: ['£<50', '£50–100', '£100–150', '£150+'] },
    { text: 'want green energy?', type: 'pills', key: 'green', options: ['yes', 'no'] },
    { text: 'own or rent?', type: 'pills', key: 'tenure', options: ['rent', 'own'] },
    { text: 'bundle deals?', type: 'pills', key: 'bundle', options: ['broadband', 'mobile', 'both', 'no'] }
  ],
  food: [
    { text: 'home-cooked meals?', type: 'pills', key: 'meals', options: ['0–3', '4–7', '8–14'] },
    { text: 'meat frequency?', type: 'pills', key: 'meat', options: ['never', 'sometimes', 'daily'] },
    { text: 'takeaway frequency?', type: 'pills', key: 'takeaway', options: ['never', 'weekly', '2–3×/wk', '4+'] },
    { text: 'shop where?', type: 'pills', key: 'shopping', options: ['local', 'supermarket', 'mix'] },
    { text: 'food waste?', type: 'pills', key: 'waste', options: ['rarely', 'sometimes', 'often'] },
    { text: 'want meal tips?', type: 'pills', key: 'tips', options: ['yes', 'no'] }
  ],
  home: [
    { text: 'household size?', type: 'pills', key: 'household', options: ['1', '2', '3', '4', '5+'] },
    { text: 'property type?', type: 'pills', key: 'property', options: ['flat', 'terraced', 'semi', 'detached', 'shared'] },
    { text: 'heating type?', type: 'pills', key: 'heating', options: ['gas', 'electric', 'heat-pump', 'other'] },
    { text: 'home insulation?', type: 'pills', key: 'insulation', options: ['yes', 'no', 'unknown'] },
    { text: 'smart meters?', type: 'pills', key: 'smart', options: ['yes', 'no'] },
    { text: 'energy upgrades?', type: 'pills', key: 'upgrades', options: ['quick-wins', 'retrofit', 'quotes'] }
  ],
  shop: [
    { text: 'most purchased?', type: 'pills', key: 'category', options: ['clothes', 'tech', 'home', 'other'] },
    { text: 'shopping preference?', type: 'pills', key: 'preference', options: ['new', 'second-hand', 'refurb'] },
    { text: 'buy second-hand?', type: 'pills', key: 'quality', options: ['high', 'medium', 'low'] },
    { text: 'monthly spend?', type: 'pills', key: 'spend', options: ['£0–50', '£50–100', '£100–200', '£200+'] },
    { text: 'delivery speed?', type: 'pills', key: 'delivery', options: ['standard', 'fast'] },
    { text: 'want greener options?', type: 'pills', key: 'suggestions', options: ['yes', 'no'] }
  ],
  waste: [
    { text: 'recycling habits?', type: 'pills', key: 'recycle', options: ['never', 'sometimes', 'always'] },
    { text: 'composting?', type: 'pills', key: 'compost', options: ['yes', 'no'] },
    { text: 'weekly rubbish?', type: 'pills', key: 'bags', options: ['1', '2', '3+'] },
    { text: 'repair items?', type: 'pills', key: 'repair', options: ['yes', 'sometimes', 'no'] },
    { text: 'donate items?', type: 'pills', key: 'donate', options: ['yes', 'sometimes', 'no'] },
    { text: 'join reuse scheme?', type: 'pills', key: 'reuse', options: ['yes', 'no'] }
  ],
  holiday: [
    { text: 'holiday type?', type: 'pills', key: 'holidayType', options: ['beach', 'city break', 'retreat', 'camping', 'skiing', 'family resort'] },
    { text: 'travel distance?', type: 'slider', key: 'distance', min: 0, max: 10000, unit: 'km' },
    { text: 'transport method?', type: 'pills', key: 'transport', options: ['train', 'car', 'flight', 'coach', 'ferry'] },
    { text: 'eco-friendly options?', type: 'pills', key: 'ecoFriendly', options: ['yes', 'no'] },
    { text: 'eco holiday type?', type: 'pills', key: 'ecoType', options: ['retreat', 'farm stay', 'camping', 'train adventure', 'forest cabin'], condition: (answers) => answers.ecoFriendly === 'yes' },
    { text: 'trip duration?', type: 'slider', key: 'duration', min: 1, max: 30, unit: 'days' }
  ],
  money: [
    { text: 'monthly spend?', type: 'slider', key: 'monthlySpend', min: 0, max: 5000, unit: '£' },
    { text: 'main bank?', type: 'pills', key: 'bank', options: ['monzo', 'starling', 'barclays', 'hsbc', 'other'] },
    { text: 'biggest cost?', type: 'pills', key: 'biggestCost', options: ['energy', 'food', 'rent', 'transport', 'other'] },
    { text: 'savings habit?', type: 'pills', key: 'savings', options: ['none', '<5%', '5–10%', '>10%'] },
    { text: 'debt type?', type: 'pills', key: 'debt', options: ['none', 'credit card', 'loan', 'overdraft'] },
    { text: 'switch supplier?', type: 'pills', key: 'switch', options: ['yes', 'maybe', 'no'] }
  ],
  health: [
    { text: 'diet type?', type: 'pills', key: 'diet', options: ['meat daily', 'flexi', 'veggie', 'vegan'] },
    { text: 'exercise freq?', type: 'pills', key: 'exercise', options: ['none', '1–2x', '3–5x', 'daily'] },
    { text: 'sleep hours?', type: 'slider', key: 'sleep', min: 4, max: 10, unit: 'hrs' },
    { text: 'stress level?', type: 'pills', key: 'stress', options: ['low', 'med', 'high'] },
    { text: 'screen time?', type: 'slider', key: 'screenTime', min: 0, max: 12, unit: 'hrs/day' },
    { text: 'outdoors weekly?', type: 'pills', key: 'outdoors', options: ['rare', '1–2x', '3–5x', 'daily'] }
  ],
  profile: [
    // Home & Energy
    { text: 'location?', type: 'text', key: 'location' },
    { text: 'home type?', type: 'pills', key: 'homeType', options: ['flat', 'terraced', 'semi', 'detached'] },
    { text: 'household size?', type: 'slider', key: 'householdSize', min: 1, max: 8, unit: 'people' },
    { text: 'main heating?', type: 'pills', key: 'heating', options: ['gas', 'electric', 'heat pump', 'oil', 'none'] },
    { text: 'monthly energy bill?', type: 'number', key: 'energyBill', placeholder: '£0–400' },
    { text: 'green tariff?', type: 'pills', key: 'greenTariff', options: ['yes', 'no'] },
    
    // Travel
    { text: 'daily transport?', type: 'pills', key: 'transport', options: ['walk/cycle', 'bus', 'train', 'car (petrol)', 'car (diesel)', 'EV', 'none'] },
    { text: 'weekly distance?', type: 'slider', key: 'travelDistance', min: 0, max: 1000, unit: 'miles/week' },
    
    // Food
    { text: 'diet style?', type: 'pills', key: 'diet', options: ['vegan', 'veggie', 'pesc', 'mixed', 'meat-heavy'] },
    { text: 'takeaways/week?', type: 'slider', key: 'eatingOut', min: 0, max: 10, unit: 'meals/week' },
    
    // Shopping & Tech
    { text: 'clothes shopping?', type: 'slider', key: 'clothesShopping', min: 0, max: 10, unit: 'items' },
    { text: 'device upgrade?', type: 'pills', key: 'deviceCycle', options: ['<1y', '1–2y', '3–4y', '5y+'] },
    
    // Waste
    { text: 'recycle at home?', type: 'pills', key: 'recycling', options: ['yes', 'no'] },
    { text: 'weekly food waste?', type: 'slider', key: 'foodWaste', min: 0, max: 5, unit: 'small caddies' }
  ]
};

export function JourneyPage({ journey, onComplete, onBack, onHome }: JourneyPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [displayText, setDisplayText] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [sliderValue, setSliderValue] = useState([1]);
  const [showInput, setShowInput] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(true);

  const allQuestions = journeyQuestions[journey] || [];
  
  // Memoize filtered questions to prevent constant re-filtering
  const questions = React.useMemo(() => {
    return allQuestions.filter(q => !q.condition || q.condition(answers));
  }, [allQuestions, answers]);
  
  const question = questions[currentQuestion];

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      
      // Check if addEventListener is available (older browsers might not support it)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  useEffect(() => {
    if (!question) return;

    // Fade out first, then reset and fade in
    setQuestionVisible(false);
    setShowInput(false);
    
    // Reset values immediately to prevent flash
    setCurrentValue('');
    setSliderValue([question.min || 1]);
    
    setTimeout(() => {
      setQuestionVisible(true);

      if (prefersReducedMotion) {
        // No typing animation - show full text immediately
        setDisplayText(question.text);
        // Show input immediately if no animation
        setTimeout(() => setShowInput(true), 100);
      } else {
        // Typewriter animation with same timing as homepage
        setDisplayText('');
        let charIndex = 0;
        let timeoutId: NodeJS.Timeout;

        const typeWriter = () => {
          if (charIndex < question.text.length) {
            setDisplayText(question.text.substring(0, charIndex + 1));
            charIndex++;
            timeoutId = setTimeout(typeWriter, 65); // Same 65ms timing as homepage
          } else {
            // Question finished animating, show input after delay
            setTimeout(() => setShowInput(true), 300);
          }
        };

        typeWriter();

        // Cleanup function to prevent memory leaks
        return () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };
      }
    }, 150); // Small delay to prevent flash
  }, [currentQuestion, question, prefersReducedMotion]);

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [question.key]: value };
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      onComplete(newAnswers);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      // Go back one question within the journey
      setCurrentQuestion(prev => prev - 1);
    } else {
      // Go back to previous page
      onBack();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentValue.trim()) {
      handleAnswer(currentValue.trim());
    }
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleSliderComplete = () => {
    handleAnswer(sliderValue[0]);
  };

  if (!question) {
    return null;
  }

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="type your answer..."
            className="w-full max-w-lg zz-input"
            autoFocus
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={question.placeholder || "enter number..."}
            className="w-full max-w-lg zz-input"
            autoFocus
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="w-full max-w-lg zz-input"
            autoFocus
          />
        );

      case 'slider':
        return (
          <div className="w-full max-w-[1200px] space-y-6 mx-auto">
            <div className="text-center">
              <div className="text-[32px] font-bold text-white mb-2">
                {sliderValue[0]}
              </div>
              <div className="text-[20px] font-bold text-white/60">
                {question.unit}
              </div>
            </div>
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              min={question.min}
              max={question.max}
              step={1}
              className="w-full"
            />
            <div className="text-center">
              <button 
                onClick={handleSliderComplete}
                className="btn-80 btn-primary uppercase"
              >
                next
              </button>
            </div>
          </div>
        );

      case 'pills':
        return (
          <PillChoices
            options={question.options}
            value={currentValue}
            onChange={handleAnswer}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="zz-journey">
      {/* row 1: header (no stroke) */}
      <div className="w-full max-w-5xl flex items-center justify-between px-5 pt-4 pb-2">
        {/* Back Button – Solid Style */}
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Journey & Progress */}
        <div className="text-center flex flex-col items-center">
          <p className="text-[20px] font-bold text-white uppercase">{journey}</p>
          <p className="text-sm text-white/60">
            {currentQuestion + 1}/{questions.length}
          </p>
          <div className="w-32 bg-white/20 h-1 rounded-full mt-1">
            <div
              className="bg-white h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Home Button */}
        {onHome && (
          <button
            onClick={onHome}
            aria-label="Go home"
            className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        )}
        {!onHome && <div className="w-10 h-10" />}
      </div>

      {/* row 2: question (fixed height) */}
      <div className="zz-qbox px-4 lg:px-8">
        <div 
          className={`transition-opacity duration-300 ${
            questionVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-center lg:text-left" style={{ fontSize: 'var(--h2)', fontWeight: 800, lineHeight: 1.2 }}>
            {displayText}
          </h2>
        </div>
      </div>

      {/* row 3: answers/input (reserved height) */}
      <div className="zz-ibox px-4 lg:px-8">
        {showInput && (
          <div 
            className="animate-fade-in-up"
          >
            {renderInput()}
          </div>
        )}
      </div>

      {/* row 4: actions (fixed 120px) — BUTTON NEVER MOVES */}
      <div className="zz-actions">
        {(question.type === 'text' || question.type === 'date' || question.type === 'number') && currentValue && (
          <button 
            onClick={() => handleAnswer(currentValue)}
            className="btn-80 btn-primary uppercase"
          >
            next
          </button>
        )}
      </div>
    </div>
  );
}