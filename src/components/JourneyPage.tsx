import React from 'react';

interface JourneyPageProps { onComplete: (answers: any) => void; }

export default function JourneyPage({ onComplete }: JourneyPageProps) {
  const handleFinish = () => {
    const demoAnswers = { travel: 50, diet: 'low-meat' };
    onComplete(demoAnswers);
  };

  return (
    <div>
      <h2>Journey Setup</h2>
      <button onClick={handleFinish}>Finish Journey</button>
    </div>
  );
}
