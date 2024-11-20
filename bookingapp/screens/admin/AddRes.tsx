import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TextInput } from "react-native-paper";
import MapView, { Marker, Callout } from "react-native-maps";
import axios from "axios";
import BottomSheet from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { API_URL } from "@env";
import * as Location from "expo-location"; // Importing Expo Location API

// Define the param types for navigation
type RootStackParamList = {
  AddRes: undefined;
  ResInfo: { longitude: number | null; latitude: number | null };
};

const AddRes: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'AddRes'>>();
  const mapRef = useRef<MapView | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);  // Image state
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const snapPoints = useMemo(() => ["20%", "40%", "60%", "85%", "90%"], []);

  // Handle map click
  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
  };

  // Get user's current location
  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } else {
        console.error("Location permission denied");
      }
    };

    getLocation();
  }, []);

  // Send restaurant data to backend
  const addRestaurant = async () => {
    try {
      const response = await axios.post(`${API_URL}/restaurants`, {
        name,
        description,
        image,
        location: {
          latitude,
          longitude,
        },
        address,
        type,
      });

      // After success, navigate back or to another screen
      navigation.goBack();  // Or use navigate to refresh map
    } catch (error) {
      console.error('Error adding restaurant:', error);
    }
  };

  const CustomCallout = ({ title, description, image }: { title: string; description: string; image: string | null }) => {
    return (
      <View style={styles.calloutContainer}>
        <Text style={styles.calloutTitle}>{title}</Text>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.calloutImage}
            resizeMode="cover"
          />
        ) : (
          <Text>Image not available</Text>
        )}
        <Text style={styles.calloutDescription}>{description}</Text>
      </View>
    );
  };

  // Zoom In function
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

  // Zoom Out function
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
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: latitude || 21.0285, // Use user's location if available
          longitude: longitude || 105.8542, // Use user's location if available
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {latitude && longitude && (
          <Marker
            coordinate={{
              latitude,
              longitude,
            }}
          >
            <Image
              source={require("../../assets/img/restaurant.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="cover"
            />
            <Callout style={{ flex: -1, position: "absolute", width: 200, bottom: -200 }}>
              <CustomCallout
                title={"Selected Location"}
                description={address}
                image={image}  // Display image if available
              />
            </Callout>
          </Marker>
        )}
      </MapView>

      {/* Zoom In button */}
      <TouchableOpacity
        style={[styles.zoomButton, { top: 50, right: 20 }]}
        onPress={zoomIn}
      >
        <AntDesign name="pluscircle" size={40} color="#22BF73" />
      </TouchableOpacity>

      {/* Zoom Out button */}
      <TouchableOpacity
        style={[styles.zoomButton, { top: 100, right: 20 }]}
        onPress={zoomOut}
      >
        <AntDesign name="minuscircle" size={40} color="#22BF73" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.myLocationIcon, styles.shadow]}
        onPress={() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: latitude || 21.0285,
              longitude: longitude || 105.8542,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }
        }}
      >
        <MaterialIcons name="my-location" size={40} color="#22BF73" />
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        onChange={handleSheetChanges}
        style={styles.sheetContainer}
        handleIndicatorStyle={styles.sheetHandleIndicator}
        backgroundStyle={{ backgroundColor: "#FAFAFA" }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            label="Tên Nhà Hàng"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Mô Tả"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <TextInput
            label="Loại"
            value={type}
            onChangeText={setType}
            style={styles.input}
          />

          <TouchableOpacity onPress={addRestaurant} style={styles.submitButton}>
            <Text style={styles.submitText}>Thêm Nhà Hàng</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  myLocationIcon: {
    position: "absolute",
    width: 50,
    height: 50,
    right: 10,
    top: "30%",
    marginTop: -12,
    zIndex: 1000,
  },
  zoomButton: {
    position: "absolute",
    zIndex: 1000,
  },
  sheetContainer: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sheetHandleIndicator: {
    backgroundColor: "#000",
    width: 40,
  },
  shadow: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    margin: 10,
    width: "90%",
    backgroundColor: "#EFEFF0",
    borderRadius: 12,
  },
  submitButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#21BF73",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    fontSize: 18,
    color: "#fff",
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    color: "#666",
  },
  calloutImage: {
    height: 200,
    width: 200,
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default AddRes;
