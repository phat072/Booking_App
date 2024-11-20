import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as Location from "expo-location";
import { API_URL } from "@env";
import useDistance from "./useDistance";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Restaurant {
  id: string; // Adjust based on your API response
  name: string; // Adjust based on your API response
  location: {
    coordinates: [number, number]; // Assuming [longitude, latitude]
  };
  distance?: string; // Calculated distance
}

const useNearbyRestaurants = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const { calculateDistance } = useDistance();

  // Function to get user's current location
  const getUserLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        console.log("Permission to access location was denied");
      }
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  }, []);

  // Function to fetch restaurant data and calculate distances
  const fetchDataAndCalculateDistances = useCallback(async () => {
    try {
      if (!userLocation) {
        await getUserLocation();
      }

      if (userLocation) {
        const response = await axios.get<{ nearbyRestaurants: Restaurant[] }>(
          `${API_URL}/nearby-restaurants`,
          {
            params: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
          }
        );

        const restaurantsWithDistance = response.data.nearbyRestaurants.map(
          (restaurant) => {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              restaurant.location.coordinates[1], // Latitude
              restaurant.location.coordinates[0] // Longitude
            );

            return { ...restaurant, distance };
          }
        );

        setNearbyRestaurants(restaurantsWithDistance);
      }
    } catch (error) {
      console.error("Error fetching or calculating distances:", error);
    }
  }, [userLocation, getUserLocation, calculateDistance]);

  // Fetch data when the component mounts or user location changes
  useEffect(() => {
    fetchDataAndCalculateDistances();
  }, [fetchDataAndCalculateDistances]);

  return { nearbyRestaurants, userLocation };
};

export default useNearbyRestaurants;
