import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Image, Text, Alert, StyleSheet } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { API_URL } from "@env";
import ZoomControls from "../../components/zoom/Zoom";

const haversineDistance = (coords1: any, coords2: any) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);

  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [mapType, setMapType] = useState<'satellite' | 'terrain'>('satellite'); // State for map type
  const mapRef = useRef<MapView>(null);
  console.log(userLocation);
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

  const set3DView = async () => {
    if (mapRef.current) {
      const camera = await mapRef.current.getCamera();
      mapRef.current.animateCamera({
        ...camera,
        pitch: 60, // Góc nghiêng của camera
        heading: 90, // Hướng của camera
      });
    }
  };

  // Use useCallback to memoize the toggleMapType function
  const toggleMapType = useCallback(() => {
    setMapType((prevType) => {
      const newType = prevType === 'satellite' ? 'terrain' : 'satellite';
      return newType;
    });
  }, []);  // Empty dependency array to ensure the function is stable

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE} 
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation?.latitude || 10.75,
          longitude: userLocation?.longitude || 106.61,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        mapType={mapType} // Dynamically set mapType
      >
        {restaurants.map((restaurant) => {
          const distance = userLocation
            ? haversineDistance(userLocation, {
                latitude: restaurant.location.coordinates[1],
                longitude: restaurant.location.coordinates[0],
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
                <View style={styles.calloutmapContainer}>
                  <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                  <Text style={styles.calloutText}>Distance: {distance} km</Text>
                  <Text style={styles.calloutText}>Address: {restaurant.address}</Text>
                  <Text style={styles.calloutText}>Opening: {restaurant.openingHours}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Tích hợp component ZoomControls */}
      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />

      {/* Nút kích hoạt chế độ xem 3D */}
      <View style={styles.ThreeDButtonContainer}>
        <Text style={styles.ThreeDButton} onPress={set3DView}>
          View 3D
        </Text>
      </View>

      {/* Nút chuyển đổi giữa các chế độ bản đồ */}
      <View style={styles.MapTypeButtonContainer}>
        <Text style={styles.MapTypeButton} onPress={toggleMapType}>
          Toggle Map
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calloutmapContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#008E97",
  },
  calloutText: {
    fontSize: 13,
    color: "#333",
  },
  ThreeDButtonContainer: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "#fff",
    padding: 7,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  ThreeDButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
  },
  MapTypeButtonContainer: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#fff",
    padding: 7,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  MapTypeButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
  },
});

export default MapScreen;
