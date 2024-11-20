const useDistance = () => {
  /**
   * Calculate the distance between two geographic points using the Haversine formula.
   * 
   * @param lat1 - Latitude of the first point in decimal degrees.
   * @param lon1 - Longitude of the first point in decimal degrees.
   * @param lat2 - Latitude of the second point in decimal degrees.
   * @param lon2 - Longitude of the second point in decimal degrees.
   * @returns The distance in kilometers as a string formatted to 2 decimal places.
   */
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): string => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Difference in latitude (radians)
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Difference in longitude (radians)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Calculate the distance
    return distance.toFixed(2); // Format to 2 decimal places
  };

  return { calculateDistance };
};

export default useDistance;
