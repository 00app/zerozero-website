/**
 * OpenEcoMap integration - Find nearby green places
 * Free API, no key required
 */

export interface Place {
  name: string;
  address: string;
  mapsUrl: string;
  distance?: number;
}

/**
 * Find eco-friendly places near a location
 * Uses OpenStreetMap Overpass API for recycling, refill stations, repair cafes, etc.
 */
export async function findGreenPlaces(lat: number, lon: number): Promise<Place[]> {
  try {
    // Overpass API query for eco-related amenities
    const query = `
      [out:json][timeout:10];
      (
        node["amenity"="recycling"](around:3000,${lat},${lon});
        node["shop"="second_hand"](around:3000,${lat},${lon});
        node["shop"="charity"](around:3000,${lat},${lon});
        node["amenity"="repair_cafe"](around:3000,${lat},${lon});
        node["shop"="zero_waste"](around:3000,${lat},${lon});
      );
      out body 10;
    `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error('Overpass API failed');
    }
    
    const data = await res.json();
    
    return data.elements.slice(0, 6).map((p: any) => ({
      name: p.tags?.name || getPlaceName(p.tags),
      address: getAddress(p.tags) || 'Address unavailable',
      mapsUrl: `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=17/${p.lat}/${p.lon}`,
      distance: calculateDistance(lat, lon, p.lat, p.lon),
    }));
  } catch (error) {
    console.error('Error fetching green places:', error);
    // Return fallback suggestions
    return getFallbackPlaces();
  }
}

function getPlaceName(tags: any): string {
  if (tags.amenity === 'recycling') return 'Recycling point';
  if (tags.shop === 'second_hand') return 'Second-hand shop';
  if (tags.shop === 'charity') return 'Charity shop';
  if (tags.amenity === 'repair_cafe') return 'Repair cafe';
  if (tags.shop === 'zero_waste') return 'Zero waste shop';
  return 'Eco place';
}

function getAddress(tags: any): string {
  const parts = [];
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
  return parts.join(', ');
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

function getFallbackPlaces(): Place[] {
  return [
    {
      name: 'Find local recycling',
      address: 'Search your postcode at gov.uk',
      mapsUrl: 'https://www.gov.uk/find-local-council',
    },
    {
      name: 'Find charity shops',
      address: 'Support reuse in your area',
      mapsUrl: 'https://www.charityretail.org.uk/shop-finder/',
    },
    {
      name: 'Find repair cafes',
      address: 'Fix instead of replace',
      mapsUrl: 'https://www.repaircafe.org/en/',
    },
  ];
}
