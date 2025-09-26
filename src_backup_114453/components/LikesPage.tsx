import React from 'react';

interface LikesPageProps { onBack: () => void; }

export default function LikesPage({ onBack }: LikesPageProps) {
  return (
    <div>
      <h2>Saved Likes</h2>
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
}
