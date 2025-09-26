import React from 'react';

interface ChatPageProps { onBack: () => void; }

export default function ChatPage({ onBack }: ChatPageProps) {
  return (
    <div>
      <h2>Zai Chat</h2>
      <button onClick={onBack}>Back</button>
    </div>
  );
}
