import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput, Portal, Dialog, Button } from "react-native-paper";
import { pickImages } from "../../utils/PickImage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { API_URL } from "@env";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "@/constants/Colors";

// Hàm generateUUID thay thế uuidv4()
const generateUUID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
};

interface RouteParams {
  longitude?: number;
  latitude?: number;
}

interface Category {
  key: string;
  value: string;
}

type RootStackParamList = {
  Home: undefined;
  ResAdmin: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ResInfo = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { longitude, latitude } = route.params as RouteParams;

  const [images, setImages] = useState<string[]>([]);
  const [imagesPrice, setImagesPrice] = useState<string[]>([]);
  const [imagesAlbum, setImagesAlbum] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [openingHours, setOpeningHours] = useState<string>("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const hideDialog = () => setVisible(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      const newArray = data.map((item: { _id: string; name: string }) => ({
        key: item._id,
        value: item.name,
      }));
      setCategories(newArray);
      setLoading(false);
    } catch (error) {
      setError("Error fetching categories");
      setLoading(false);
    }
  };

  const handlePickImages = async (
    imageState: string[],
    setImagesCallback: React.Dispatch<React.SetStateAction<string[]>>,
    allowMultipleSelection = false
  ) => {
    try {
      const result = await pickImages({
        currentImages: imageState,
        multiple: allowMultipleSelection,
      });
      if (result.length > 0) {
        setImagesCallback(result);
      }
    } catch (error) {
      console.log("Error picking images:", error);
    }
  };

  const uploadImage = async (imageUri: string): Promise<string | null> => {
    const formData = new FormData();

    const fileBlob = await fetch(imageUri)
      .then((res) => res.blob())
      .then((blob) => ({
        uri: imageUri,
        name: generateUUID() + ".jpg", // Sử dụng generateUUID thay vì uuidv4
        type: "image/jpeg",
        blob: blob,
      }));

    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET_RES || 'default-upload-preset';

    formData.append("file", fileBlob.blob, fileBlob.name);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(process.env.CLOUDINARY_UPLOAD_URL!, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.secure_url) {
        return response.data.secure_url;
      } else {
        console.error("Failed to upload image:", response.data);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleAddRestaurant = async () => {
    const fields: string[] = [];
    if (!name) fields.push("Name");
    if (!description) fields.push("Description");
    if (!address) fields.push("Address");
    if (!longitude || !latitude) fields.push("Location");
    if (!selectedCategory) fields.push("Category");
    if (images.length === 0) fields.push("Image");

    if (fields.length > 0) {
      setMissingFields(fields);
      setVisible(true);
      return;
    }

    try {
      const imageUrls = await Promise.all(images.map(uploadImage));
      const filteredImageUrls = imageUrls.filter((url) => url !== null);

      const restaurantData = {
        name,
        description,
        image: filteredImageUrls[0], // Chọn hình ảnh đầu tiên từ các ảnh đã tải lên
        address,
        location: {
          type: "Point",
          coordinates: [longitude!, latitude!],
        },
        rating: 4,
        type: selectedCategory,
        openingHours,
      };

      const response = await fetch(`${API_URL}/restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restaurantData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Restaurant added successfully", data);
        navigation.navigate("ResAdmin");
      } else {
        console.error("Failed to add restaurant");
      }
    } catch (error) {
      console.error("Error adding restaurant:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.modalView}>
        {longitude && latitude ? (
          <View style={{ borderWidth: 2, padding: 16, borderColor: "indigo", marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontStyle: "italic", color: "#0066cc", fontWeight: "bold", textAlign: "center" }}>
              Restaurant address selected
            </Text>
            <Text style={{ fontSize: 16, marginTop: 8, textAlign: "center", fontWeight: "600" }}>
              Longitude: {longitude}
            </Text>
            <Text style={{ fontSize: 16, marginTop: 8, textAlign: "center", fontWeight: "600" }}>
              Latitude: {latitude}
            </Text>
          </View>
        ) : (
          <View style={{ borderWidth: 1, padding: 16, borderColor: Colors.primary, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <AntDesign name="warning" size={30} color={Colors.primary} />
              <Text style={{ fontSize: 16, color: Colors.primary, fontWeight: "bold" }}>Longitude and Latitude are missing!!!</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", marginTop: 12, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: Colors.primary }}>Go back to map</Text>
              <Ionicons name="location-sharp" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        <TextInput label="Restaurant Name" value={name} onChangeText={(text) => setName(text)} style={styles.input} />
        <TextInput label="Description" value={description} onChangeText={(text) => setDescription(text)} style={styles.input} />
        <TextInput label="Address" value={address} onChangeText={(text) => setAddress(text)} style={styles.input} />
        <SelectList setSelected={setSelectedCategory} data={categories} save="key" search={false} boxStyles={{ marginBottom: 20 }} inputStyles={{ fontSize: 16 }} />
        <Button onPress={handleAddRestaurant} mode="contained">Add Restaurant</Button>
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Missing Fields</Dialog.Title>
          <Dialog.Content>
            <Text>Please fill in the following fields: {missingFields.join(", ")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    marginTop: 20,
  },
  input: {
    marginBottom: 10,
  },
});

export default ResInfo;
