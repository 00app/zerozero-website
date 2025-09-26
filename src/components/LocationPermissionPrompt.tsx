import React, { useState } from 'react';

interface LocationPermissionPromptProps {
  onAllow: (latitude: number, longitude: number) => void;
  onDeny: () => void;
}

export function LocationPermissionPrompt({ onAllow, onDeny }: LocationPermissionPromptProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAllow = async () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      setIsLoading(false);
      onDeny();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLoading(false);
        onAllow(latitude, longitude);
      },
      (error) => {
        let errorMessage = 'Unknown geolocation error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = `Geolocation error: ${error.message || 'Unknown error'}`;
            break;
        }
        
        console.log('Location access failed:', errorMessage);
        setIsLoading(false);
        onDeny();
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 8000, // Reduced timeout
        maximumAge: 600000 // 10 minutes cache
      }
    );
  };

  const handleNotNow = () => {
    onDeny();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl max-w-sm w-full mx-auto"
        style={{ padding: '32px' }}
      >
        {/* Title */}
        <h2 
          className="text-black font-bold text-center mb-4"
          style={{ 
            fontSize: '32px', 
            textTransform: 'lowercase',
            lineHeight: '1.1'
          }}
        >
          use location?
        </h2>

        {/* Body */}
        <p 
          className="text-center mb-8"
          style={{ 
            fontSize: '16px', 
            fontWeight: '500',
            color: '#444',
            lineHeight: '1.4',
            textTransform: 'none'
          }}
        >
          we use your location to show you local tips, offers and impact data.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleAllow}
            disabled={isLoading}
            className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
            style={{ 
              fontSize: '16px',
              textTransform: 'uppercase',
              minWidth: '80px'
            }}
          >
            {isLoading ? '...' : 'allow'}
          </button>
          
          <button
            onClick={handleNotNow}
            disabled={isLoading}
            className="bg-white text-black border border-black px-6 py-2 rounded-full font-bold hover:bg-gray-50 transition-colors duration-200"
            style={{ 
              fontSize: '16px',
              textTransform: 'uppercase'
            }}
          >
            not now
          </button>
        </div>
      </div>
    </div>
  );
}