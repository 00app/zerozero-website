// Utility functions for location-based features

export interface UserLocation {
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
}

// Get approximate country/region from coordinates (simplified)
export function getRegionFromCoordinates(latitude: number, longitude: number): { country: string; region: string } {
  // Simple coordinate-based region detection
  // In a real app, you'd use a reverse geocoding service
  
  // UK bounds (approximate)
  if (latitude >= 49.9 && latitude <= 60.9 && longitude >= -8.2 && longitude <= 1.8) {
    return { country: 'UK', region: 'United Kingdom' };
  }
  
  // Germany bounds (approximate)
  if (latitude >= 47.3 && latitude <= 55.1 && longitude >= 5.9 && longitude <= 15.0) {
    return { country: 'DE', region: 'Germany' };
  }
  
  // France bounds (approximate)
  if (latitude >= 41.3 && latitude <= 51.1 && longitude >= -5.1 && longitude <= 9.6) {
    return { country: 'FR', region: 'France' };
  }
  
  // Netherlands bounds (approximate)
  if (latitude >= 50.7 && latitude <= 53.7 && longitude >= 3.2 && longitude <= 7.2) {
    return { country: 'NL', region: 'Netherlands' };
  }
  
  // Default to EU for European coordinates
  if (latitude >= 34.8 && latitude <= 71.2 && longitude >= -25.0 && longitude <= 44.8) {
    return { country: 'EU', region: 'Europe' };
  }
  
  // Default fallback
  return { country: 'GLOBAL', region: 'Global' };
}

// Get localized tips based on location
export function getLocalizedTips(userLocation: UserLocation | null) {
  if (!userLocation) {
    return {
      energyProvider: 'renewable energy',
      transportMode: 'public transport',
      currency: '£',
      recyclingService: 'local council'
    };
  }
  
  const region = getRegionFromCoordinates(userLocation.latitude, userLocation.longitude);
  
  switch (region.country) {
    case 'UK':
      return {
        energyProvider: 'octopus energy',
        transportMode: 'rail travel',
        currency: '£',
        recyclingService: 'council collection'
      };
    case 'DE':
      return {
        energyProvider: 'renewable tariffs',
        transportMode: 'db trains',
        currency: '€',
        recyclingService: 'pfand system'
      };
    case 'FR':
      return {
        energyProvider: 'edf renewable',
        transportMode: 'sncf trains',
        currency: '€',
        recyclingService: 'tri sélectif'
      };
    case 'NL':
      return {
        energyProvider: 'groene stroom',
        transportMode: 'ns trains',
        currency: '€',
        recyclingService: 'gemeentelijke inzameling'
      };
    default:
      return {
        energyProvider: 'green energy',
        transportMode: 'train travel',
        currency: '€',
        recyclingService: 'local recycling'
      };
  }
}

// Check if location permission is supported
export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}

// Get user's location with promise-based API
export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const region = getRegionFromCoordinates(latitude, longitude);
        resolve({
          latitude,
          longitude,
          country: region.country,
          region: region.region
        });
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
            errorMessage = error.message || 'Unknown geolocation error';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false, // Better compatibility
        timeout: 8000, // 8 seconds
        maximumAge: 600000 // 10 minutes cache
      }
    );
  });
}