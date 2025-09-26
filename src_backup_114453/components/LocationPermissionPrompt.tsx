import React from 'react';

interface LocationPermissionPromptProps { onNext: () => void; }

export default function LocationPermissionPrompt({ onNext }: LocationPermissionPromptProps) {
  return (
    <div>
      <h2>Allow Location Access</h2>
      <button onClick={onNext}>Continue</button>
    </div>
  );
}
