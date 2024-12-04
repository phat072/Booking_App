import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from "react-native";
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { TextInput } from "react-native-paper";
import MapView, { Marker, Callout } from "react-native-maps";
import axios from "axios";
import BottomSheet from "@gorhom/bottom-sheet";
import ZoomControls from "@/components/zoom/Zoom";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { API_URL } from "@env";
import * as Location from "expo-location"; // Importing Expo Location API
import RNPickerSelect from "react-native-picker-select"; // Import Picker


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

  const [categories, setCategories] = useState<any[]>([]);  // State to store categories

  // Handle sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const snapPoints = useMemo(() => ["20%", "40%", "60%", "85%", "90%"], []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories/`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle map press
  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
    console.log("Đã click vào bản đồ, tọa độ:", { latitude, longitude });
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
          type: "Point",
          coordinates: [longitude!, latitude!],
        },
        address,
        type,
      });
      navigation.goBack(); // Navigate back after success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error adding restaurant:", error.response ? error.response.data : error.message);
      } else {
        console.error("Error adding restaurant:", error);
      }
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
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: latitude || 10.869891, //10.869891, 106.803556: UIT 
          longitude: longitude || 106.803556,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {latitude && longitude && (
          <Marker coordinate={{ latitude, longitude }}>
            <Image source={require("../../assets/img/restaurant.png")} style={{ width: 40, height: 40 }} resizeMode="cover" />
            <Callout style={{ flex: -1, position: "absolute", width: 200, bottom: -200 }}>
              <CustomCallout title={"Selected Location"} description={address} image={image} />
            </Callout>
          </Marker>
        )}
      </MapView>
      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
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
        <MaterialIcons name="my-location" size={20} color="#22BF73" />
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
          <TextInput label="Tên Nhà Hàng" value={name} onChangeText={setName} style={styles.inputres} />
          <TextInput label="Mô Tả" value={description} onChangeText={setDescription} style={styles.inputres} />
          
          {/* Dropdown for selecting type */}
          <RNPickerSelect
            onValueChange={(value) => setType(value)}  // Set the selected category ID
            items={categories.map(category => ({
              label: category.name,
              value: category._id,
              key: category._id,
            }))}
            placeholder={{ label: "Chọn loại món ăn", value: null }}  // Placeholder for the dropdown
            style={pickerSelectStyles}
          />

          <TextInput label="Địa chỉ" value={address} onChangeText={setAddress} style={styles.inputres} />
          <TextInput label="Link hình ảnh (URL)" value={image || ""} onChangeText={setImage} style={styles.inputres} />

          <TouchableOpacity onPress={addRestaurant} style={styles.submitButton}>
            <Text style={styles.submitText}>Thêm Nhà Hàng</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    margin: 3,
    width: "90%",
    backgroundColor: "#EFEFF0",
    borderRadius: 8,
    color:'black',
    fontSize: 13
  },
  inputAndroid: {
    margin: 3,
    width: "90%",
    backgroundColor: "#EFEFF0",
    borderRadius: 8,
    color:'black',
    fontSize: 13
  },
});

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",  
  },
  map: {  
    width: "100%",
    height: "100%",
  },
  inputres: {
    margin: 3,
    width: "90%",
    backgroundColor: "#EFEFF0",
    borderRadius: 8,
    fontSize: 13,
    color: 'black'
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
    fontSize: 13,
    color: "#fff",
  },
  myLocationIcon: { 
    position: "absolute",
    right: 5,
    top: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  shadow: { 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  sheetContainer: {  
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  sheetHandleIndicator: {  
    backgroundColor: "#ccc",
    width: 50,
    height: 3,
    borderRadius: 10,
    marginTop: 10,
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
