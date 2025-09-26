import React, { useState, useRef, useEffect } from 'react';
import { ZaiChatBubble } from './ZaiChatBubble';

interface ChatPageProps {
  onJourneySelect: (journey: string) => void;
  onBack: () => void;
}

export function ChatPage({ onJourneySelect, onBack }: ChatPageProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  // Mock AI agent logic - future-proofed for OpenAI integration
  const getZaiResponse = (userText) => {
    const text = userText.toLowerCase();
    
    // Travel intent
    if (text.includes('travel') || text.includes('train') || text.includes('flight') || text.includes('paris') || text.includes('london') || text.includes('holiday') || text.includes('trip')) {
      return {
        type: 'zai',
        label: 'suggestion',
        copy: 'trains cut co2 by 90% vs flights and coaches are usually cheapest. book direct for best deals.',
        actions: [
          { label: 'book train', href: 'https://www.eurostar.com/' },
          { label: 'book coach', href: 'https://www.flixbus.co.uk/' },
          { label: 'compare flights', href: 'https://www.skyscanner.net/' }
        ]
      };
    }
    
    // Energy/bills intent
    if (text.includes('energy') || text.includes('bill') || text.includes('gas') || text.includes('electric') || text.includes('switch') || text.includes('supplier') || text.includes('tariff')) {
      return {
        type: 'zai',
        label: 'tip',
        copy: 'switching energy supplier takes 5 minutes and saves 300 pounds per year on average. start with price comparison.',
        actions: [
          { label: 'compare prices', href: 'https://energycompare.citizensadvice.org.uk/' },
          { label: 'switch now', href: 'https://www.zen.co.uk/' },
          { label: 'green energy', href: 'https://www.triodos.co.uk/' }
        ]
      };
    }
    
    // Food/waste intent
    if (text.includes('food') || text.includes('waste') || text.includes('recipe') || text.includes('meal') || text.includes('cook') || text.includes('takeaway')) {
      return {
        type: 'zai',
        label: 'tip',
        copy: 'food waste costs 700 pounds per household yearly. meal planning and rescue apps cut this by 80%.',
        actions: [
          { label: 'rescue food', href: 'https://www.toogoodtogo.com/en-gb' },
          { label: 'share surplus', href: 'https://olioex.com/' },
          { label: 'meal plans', href: 'https://www.bbcgoodfood.com/collections/budget-family-meal-plans' }
        ]
      };
    }
    
    // Home/heating intent
    if (text.includes('home') || text.includes('heating') || text.includes('insulation') || text.includes('thermostat') || text.includes('boiler') || text.includes('warm')) {
      return {
        type: 'zai',
        label: 'recommendation',
        copy: 'draught proofing saves 45 pounds yearly for 30 pounds cost. smart thermostats save 120 pounds annually.',
        actions: [
          { label: 'draught proof', href: 'https://www.energysavingtrust.org.uk/advice/draught-proofing/' },
          { label: 'insulation guide', href: 'https://www.energysavingtrust.org.uk/advice/insulation/' },
          { label: 'find grants', href: 'https://www.gov.uk/improve-energy-efficiency' }
        ]
      };
    }
    
    // Shopping intent
    if (text.includes('shop') || text.includes('buy') || text.includes('clothes') || text.includes('phone') || text.includes('laptop') || text.includes('second hand')) {
      return {
        type: 'zai',
        label: 'tip',
        copy: 'buying second hand saves 80% vs new and cuts carbon by 75%. repair extends life by years.',
        actions: [
          { label: 'second hand', href: 'https://www.vinted.co.uk/' },
          { label: 'repair guides', href: 'https://www.ifixit.com/' },
          { label: 'best buys', href: 'https://www.toptenuk.org/' }
        ]
      };
    }
    
    // Waste/recycling intent
    if (text.includes('waste') || text.includes('recycle') || text.includes('bin') || text.includes('plastic') || text.includes('rubbish')) {
      return {
        type: 'zai',
        label: 'info',
        copy: 'reduce first, reuse second, recycle last. composting cuts household waste by 30%.',
        actions: [
          { label: 'recycle guide', href: 'https://www.recyclenow.com/' },
          { label: 'find centre', href: 'https://www.gov.uk/find-recycling-centre' },
          { label: 'refill app', href: 'https://www.refill.org.uk/' }
        ]
      };
    }
    
    // Generic help
    if (text.includes('help') || text.includes('what') || text.includes('how') || text.includes('start')) {
      return {
        type: 'zai',
        label: 'response',
        copy: 'i help you save money and cut carbon. ask about travel, energy bills, food waste, home heating, shopping or recycling.',
        actions: [
          { label: 'travel help', onClick: () => onJourneySelect('travel') },
          { label: 'switch energy', onClick: () => onJourneySelect('switch') },
          { label: 'full setup', onClick: () => onJourneySelect('profile') }
        ]
      };
    }
    
    // Fallback
    return {
      type: 'zai',
      label: 'response',
      copy: 'tell me what you want to save money on or ask about reducing carbon in your daily life.',
      actions: [
        { label: 'travel', onClick: () => onJourneySelect('travel') },
        { label: 'energy', onClick: () => onJourneySelect('switch') },
        { label: 'setup', onClick: () => onJourneySelect('profile') }
      ]
    };
  };

  const handleSendMessage = () => {
    const textToSend = chatInput.trim();
    if (!textToSend) return;
    
    const userMessage = {
      type: 'user',
      text: textToSend,
      id: Date.now()
    };
    
    const zaiResponse = getZaiResponse(textToSend);
    const zaiMessage = {
      ...zaiResponse,
      id: Date.now() + 1
    };
    
    setMessages(prev => [...prev, userMessage, zaiMessage]);
    setChatInput('');
    
    // Scroll to bottom after messages are added
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="pt-8 md:pt-12 pb-4 flex-shrink-0">
        {/* Button Row */}
        <div className="flex items-center justify-between px-5 mb-6 max-w-md mx-auto">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="w-10"></div> {/* spacer */}
        </div>
        
        {/* Title */}
        <div className="text-[20px] font-bold text-center">chat with zai</div>
      </div>

      {/* Scrollable Chat Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={chatContainerRef}
          className="h-full overflow-y-auto px-4 scrollbar-hide"
          style={{ paddingBottom: '120px' }} // Space for fixed input
        >
          <div className="w-full max-w-md mx-auto">
            {messages.length === 0 && (
              <div className="py-8">
                <div className="bg-white/5 rounded-[40px] p-5 mb-4">
                  <div className="space-y-4">
                    <div className="text-[16px] font-bold text-white uppercase">welcome</div>
                    <div className="text-[20px] font-bold text-white/90">
                      i help you save money and cut carbon. ask me anything about travel, energy, food, home, shopping or waste.
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <ZaiChatBubble key={message.id} message={message} />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Input Box at Bottom */}
      <div className="flex-shrink-0 p-4 pb-8">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/5 rounded-[40px] px-3 py-2 flex items-center">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Zai something…"
              className="flex-1 bg-transparent text-white text-[18px] font-normal placeholder:text-white/60 border-none outline-none px-3 py-1"
              style={{ fontSize: '18px' }}
            />
            <button
              onClick={handleSendMessage}
              className="text-white text-[18px] font-bold pl-3 pr-1 py-1 hover:text-white/80 transition-colors"
              disabled={!chatInput.trim()}
              style={{ 
                opacity: chatInput.trim() ? 1 : 0.5,
                fontSize: '18px'
              }}
            >
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}