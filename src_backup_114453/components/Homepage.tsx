import React from 'react';

interface HomepageProps { onNavigate: (page: 'chat' | 'journey' | 'results' | 'likes') => void; }

export default function Homepage({ onNavigate }: HomepageProps) {
  return (
    <div>
      <h2>Homepage</h2>
      <button onClick={() => onNavigate('chat')}>Chat with Zai</button>
      <button onClick={() => onNavigate('journey')}>Start Journey</button>
      <button onClick={() => onNavigate('results')}>View Results</button>
      <button onClick={() => onNavigate('likes')}>My Likes</button>
    </div>
  );
}
