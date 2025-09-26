import React from 'react';

interface IntroPageProps { onNext: () => void; }

export default function IntroPage({ onNext }: IntroPageProps) {
  return (
    <div>
      <h1>Welcome to Zero Zero</h1>
      <button onClick={onNext}>Get Started</button>
    </div>
  );
}
