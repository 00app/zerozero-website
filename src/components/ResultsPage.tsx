import React from 'react';

interface ResultsPageProps {
  footprint: number | null;
  tips: any[];
  onBack: () => void;
  onLikes: () => void;
}

export default function ResultsPage({ footprint, tips, onBack, onLikes }: ResultsPageProps) {
  return (
    <div>
      <h2>Your Results</h2>
      <p>Carbon footprint: {footprint ?? 'N/A'}</p>
      <ul>
        {tips.map((tip, i) => (
          <li key={i}>{tip.title}</li>
        ))}
      </ul>
      <button onClick={onBack}>Back to Home</button>
      <button onClick={onLikes}>Go to Likes</button>
    </div>
  );
}
