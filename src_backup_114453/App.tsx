import React, { useState } from 'react';

import IntroPage from './components/IntroPage';
import LocationPermissionPrompt from './components/LocationPermissionPrompt';
import Homepage from './components/Homepage';
import ChatPage from './components/ChatPage';
import JourneyPage from './components/JourneyPage';
import ResultsPage from './components/ResultsPage';
import LikesPage from './components/LikesPage';

import { computeFootprint } from './utils/computeFootprint';
import { buildTips } from './utils/buildTips';

function App() {
  const [page, setPage] = useState<'intro' | 'location' | 'home' | 'chat' | 'journey' | 'results' | 'likes'>('intro');
  const [footprint, setFootprint] = useState<number | null>(null);
  const [tips, setTips] = useState<any[]>([]);

  const handleCompleteJourney = (answers: any) => {
    const fp = computeFootprint(answers);
    setFootprint(fp);
    setTips(buildTips(fp));
    setPage('results');
  };

  return (
    <>
      {page === 'intro' && <IntroPage onNext={() => setPage('location')} />}
      {page === 'location' && <LocationPermissionPrompt onNext={() => setPage('home')} />}
      {page === 'home' && <Homepage onNavigate={setPage} />}
      {page === 'chat' && <ChatPage onBack={() => setPage('home')} />}
      {page === 'journey' && <JourneyPage onComplete={handleCompleteJourney} />}
      {page === 'results' && (
        <ResultsPage
          footprint={footprint}
          tips={tips}
          onBack={() => setPage('home')}
          onLikes={() => setPage('likes')}
        />
      )}
      {page === 'likes' && <LikesPage onBack={() => setPage('home')} />}
    </>
  );
}

export default App;
