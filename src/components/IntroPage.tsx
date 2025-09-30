import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import Component00BrandMark from '../imports/00BrandMark-2-28';

interface IntroPageProps {
  onComplete: () => void;
}

export function IntroPage({ onComplete }: IntroPageProps) {
  const [stage, setStage] = useState<'typing' | 'brand' | 'final'>('typing');
  const [displayText, setDisplayText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(true);

  const words = [
    'what', 'if', 'you', 'could', 'make', 'a', 'change?',
    'reset.', 'reclaim.', 'reduce.', 'recycle.', 'rethink.'
  ];

  const finalWords = ['use', 'less', 'more.'];

  useEffect(() => {
    if (stage !== 'typing') return;

    const currentWord = words[currentWordIndex];
    let charIndex = 0;

    const typeWriter = () => {
      if (charIndex < currentWord.length) {
        setDisplayText(currentWord.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeWriter, 40);
      } else {
        let delay = currentWord.endsWith('?') ? 1000 : 500;
        setTimeout(() => {
          setDisplayText('');
          if (currentWordIndex + 1 >= words.length) {
            setShowSkip(false);
            setStage('brand');
          } else {
            setCurrentWordIndex(currentWordIndex + 1);
          }
        }, delay);
      }
    };

    typeWriter();
  }, [currentWordIndex, stage]);

  useEffect(() => {
    if (stage === 'brand') {
      const timer = setTimeout(() => {
        setStage('final');
      }, 2000);
      return () => clearTimeout(timer);
    } else if (stage === 'final') {
      let i = 0;
      const showFinal = () => {
        if (i < finalWords.length) {
          setDisplayText(finalWords[i]);
          i++;
          setTimeout(showFinal, 1000);
        } else {
          setTimeout(onComplete, 1000);
        }
      };
      showFinal();
    }
  }, [stage, onComplete]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {stage === 'typing' || stage === 'final' ? (
        <h1 className="text-[80px] lg:text-[100px] font-extrabold lowercase transition-all duration-300">
          {displayText}
        </h1>
      ) : null}

      {stage === 'brand' && (
        <div className="opacity-100 transition-opacity duration-1000">
          <Component00BrandMark className="w-[300px] h-auto invert" />
        </div>
      )}

      {showSkip && (
        <button
          onClick={onComplete}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
        >
          skip
        </button>
      )}
    </div>
  );
}