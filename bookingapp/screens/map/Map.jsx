import React, { useState, useEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const GOOGLE_MAPS_APIKEY = 'AIzaSyCWN2yYAYWJR3_i5JSfnaRWN-gYwFQAr44';

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      
      fetchNearbyRestaurants(latitude, longitude);
    })();
  }, []);

  const fetchNearbyRestaurants = (latitude, longitude) => {
    const radius = 1500;
    const type = 'restaurant';

    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_APIKEY}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          setRestaurants(data.results);
        }
      })
      .catch((error) => console.log(error));
  };

  const getDirections = (destination) => {
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;

    fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${GOOGLE_MAPS_APIKEY}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes.length) {
          const points = data.routes[0].overview_polyline.points;
          const route = decodePolyline(points);
          setRouteCoordinates(route);
        }
      })
      .catch((error) => console.log(error));
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    return points;
  };

  const zoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const zoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={true}
      >
        {restaurants.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
            onPress={() => getDirections(place.geometry.location)}
          />
        ))}

        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="blue"
        />
      </MapView>

      {/* Nút Zoom In và Zoom Out */}
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
  zoomContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 10,
  },
  zoomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  zoomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008E97',
  },
});

export default MapScreen;
