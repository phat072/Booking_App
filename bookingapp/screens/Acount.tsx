import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { COLORS, SIZES } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import NetworkImage from "../components/NetworkImage";
import { API_URL } from "@env";
import { UserContext } from "../userContext";
import { RootStackParamList } from "../app/types";

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userId, setUserId, user, updateUser } = useContext(UserContext);
  const [address, setAddress] = useState<Record<string, any>>({});

  console.log(API_URL);

  const handleAvatarPress = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "Please allow access to the media library.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const imageUri = selectedImage.uri;

        // Save image path in state and call updateAddressData
        setAddress({ ...address, avatar: imageUri });
        await updateAddressData({ ...address, avatar: imageUri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const updateAddressData = async (updatedData: Record<string, any>) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No token found");

      const decodedToken: { userId: string } = jwt_decode(token);
      const userId = decodedToken.userId;

      await axios.put(`${API_URL}/address/${userId}`, updatedData);

      await fetchAddressData(userId);
    } catch (error) {
      console.log("Error updating address data", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Logout Error", "An error occurred while logging out.");
    }
  };

  const fetchAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No token found");

      const decodedToken: { userId: string } = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      await fetchAddressData(userId);
    } catch (error) {
      console.log("Error fetching address", error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddressData = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/address/${userId}`);
      const addressData = response.data;
      updateUser(addressData);
      console.log(addressData, "user fetch");
    } catch (error) {
      console.log(`${API_URL}/address/${userId}`);
      console.log("Error fetching address data", error);
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={{ backgroundColor: COLORS.offwhite, height: SIZES.height }}>
          <View style={{ backgroundColor: COLORS.offwhite, height: SIZES.height - 170 }}>
            <View style={styles.profile}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={handleAvatarPress}>
                  {user?.avatar ? (
                    <NetworkImage source={user?.avatar} width={100} height={100} radius={99} />
                  ) : (
                    <Image
                      source={require("../assets/img/default-profile.png")}
                      style={{ width: 100, height: 100, borderRadius: 99 }}
                    />
                  )}
                </TouchableOpacity>
                <View style={{ marginLeft: 10, marginTop: 30 }}>
                  <Text style={styles.text}>{user?.name}</Text>
                  <Text style={styles.email}>{user?.mobileNo}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <MaterialIcons
                  onPress={() => navigation.navigate("EditAccount")}
                  name="arrow-forward-ios"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>

            {/* Additional components and sections */}

            <View className="items-center mt-20">
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
              </TouchableOpacity>
              <Text style={{ color: "#6C6C6C", marginTop: 20 }}>Copyright 2023 by NHK & NTH</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#FEF2F2",
    padding: 15,
    borderRadius: 8,
    width: "60%",
  },
  logoutButtonText: {
    color: "#D02B39",
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    fontSize: 17,
    marginLeft: 10,
    fontFamily: "bold",
    color: COLORS.black,
  },
  email: {
    marginLeft: 10,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    margin: 20,
  },
});

export default AccountScreen;
