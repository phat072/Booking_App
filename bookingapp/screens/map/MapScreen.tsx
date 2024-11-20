import React, { useState, useEffect, useRef } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { API_URL } from "@env";

const haversineDistance = (coords1: any, coords2: any) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Bán kính Trái Đất (km)

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);

  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Khoảng cách tính bằng km
};

const MapScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Cannot access location services.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } catch (error) {
        Alert.alert("Error", "Could not fetch location.");
        console.error(error);
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${API_URL}/restaurants`);
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        Alert.alert("Error", "Could not fetch restaurant data.");
      }
    };

    fetchRestaurants();
  }, []);

  const zoomIn = async () => {
    if (mapRef.current) {
      const camera = await mapRef.current.getCamera();
      if (camera.zoom !== undefined) {
        mapRef.current.animateCamera({
          ...camera,
          zoom: camera.zoom + 1,
        });
      }
    }
  };

  const zoomOut = async () => {
    if (mapRef.current) {
      const camera = await mapRef.current.getCamera();
      if (camera.zoom !== undefined) {
        mapRef.current.animateCamera({
          ...camera,
          zoom: camera.zoom - 1,
        });
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation?.latitude || 10.75,
          longitude: userLocation?.longitude || 106.61,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {restaurants.map((restaurant) => {
          const distance = userLocation
            ? haversineDistance(userLocation, {
                latitude: restaurant.location.coordinates[1],  // latitude first
                longitude: restaurant.location.coordinates[0], // longitude second
              }).toFixed(2)
            : 0;

          return (
            <Marker
              key={restaurant._id}
              coordinate={{
                latitude: restaurant.location.coordinates[1],
                longitude: restaurant.location.coordinates[0],
              }}
              title={restaurant.name}
            >
              <Image
                source={{ uri: restaurant.image }}
                style={{ width: 40, height: 40 }}
              />
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                  <Text style={styles.calloutText}>Distance: {distance} km</Text>
                  <Text style={styles.calloutText}>Address: {restaurant.address}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Zoom buttons */}
      <View style={styles.zoomContainer}>
        <TouchableOpacity onPress={zoomIn} style={styles.zoomButton}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomOut} style={styles.zoomButton}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008E97",
  },
  calloutText: {
    fontSize: 14,
    color: "#333",
  },
  zoomContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    padding: 8,
  },
  zoomButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  zoomText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008E97",
  },
});

export default MapScreen;
