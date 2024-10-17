const PARIS_COORDS = { lat: 48.858370, lon: 2.294481 }; 

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const validateAddress = async (address: string): Promise<boolean> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodedAddress}`);
    const data = await response.json();

    if (data && data.features.length > 0) {
      const userCoords = data.features[0].geometry.coordinates;
      const userLon = userCoords[0]; // Longitude
      const userLat = userCoords[1]; // Latitude

      // Inverser si nécessaire pour vérifier les valeurs
      const distance = haversineDistance(PARIS_COORDS.lat, PARIS_COORDS.lon, userLat, userLon);
      console.log(`Distance de Paris: ${distance.toFixed(2)} km`); // Vérifier la distance affichée

      return distance <= 50;
      const distance2 = haversineDistance(48.858370, 2.294481, 46.94809, 7.44744); // Paris - Suisse (Bern)
console.log(`Distance entre Paris et Bern: ${distance2} km`); // Vous devriez obtenir une distance correcte (environ 430 km)
    }

    return false; 
  } catch (error) {
    console.error("Erreur lors de la validation de l'adresse", error);
    return false;
  }
};


export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`
    );
    const data = await response.json();

    if (data && data.features.length > 0) {
      const address = data.features[0].properties.label;
      return address;
    }

    return null;
  } catch (error) {
    console.error("Erreur lors du reverse geocoding", error);
    return null;
  }
};
