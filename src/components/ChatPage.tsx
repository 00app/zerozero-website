import React, { useState, useRef, useEffect } from 'react';
import { ZaiChatBubble } from './ZaiChatBubble';
import { codeWordAPI_chatResponse } from '../utils/codeWordAPI';

interface ChatPageProps {
  onJourneySelect: (journey: string) => void;
  onBack: () => void;
}

export function ChatPage({ onJourneySelect, onBack }: ChatPageProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  /**
   * Get AI response from codeWordAPI
   * TODO: This currently uses mock logic - replace with real OpenAI GPT-4 API
   */
  const getZaiResponse = async (userText: string) => {
    // Use codeWordAPI for chat responses
    const response = await codeWordAPI_chatResponse(userText);
    
    // Add journey navigation handlers for action buttons
    if (response.actions) {
      response.actions = response.actions.map(action => {
        // Handle special navigation actions
        if (action.label === 'travel help' || action.label === 'travel') {
          return { ...action, onClick: () => onJourneySelect('travel') };
        }
        if (action.label === 'switch energy' || action.label === 'energy') {
          return { ...action, onClick: () => onJourneySelect('switch') };
        }
        if (action.label === 'full setup' || action.label === 'setup') {
          return { ...action, onClick: () => onJourneySelect('profile') };
        }
        return action;
      });
    }
    
    return response;
  };

  const handleSendMessage = async () => {
    const textToSend = chatInput.trim();
    if (!textToSend || isLoading) return;
    
    const userMessage = {
      type: 'user',
      text: textToSend,
      id: Date.now()
    };
    
    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);
    
    try {
      // Get AI response from codeWordAPI
      const zaiResponse = await getZaiResponse(textToSend);
      const zaiMessage = {
        ...zaiResponse,
        id: Date.now() + 1
      };
      
      setMessages(prev => [...prev, zaiMessage]);
    } catch (error) {
      // Add fallback message on error
      setMessages(prev => [...prev, {
        type: 'zai',
        label: 'error',
        copy: 'sorry, something went wrong. please try again.',
        id: Date.now() + 1,
        actions: []
      }]);
    } finally {
      setIsLoading(false);
    }
    
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
              disabled={!chatInput.trim() || isLoading}
              style={{ 
                opacity: (chatInput.trim() && !isLoading) ? 1 : 0.5,
                fontSize: '18px'
              }}
            >
              {isLoading ? '...' : 'send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}