import React from 'react';

interface PillChoicesProps {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
}

export function PillChoices({ options, value, onChange }: PillChoicesProps) {
  return (
    <div className="pill-row">
      {options.map(option => (
        <button
          key={option}
          className={`pill btn-secondary${value === option ? ' selected' : ''}`}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}