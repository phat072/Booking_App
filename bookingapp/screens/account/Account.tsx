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
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { UserType } from "@/userContext";
import jwtDecode from "jwt-decode";
import { COLORS, SIZES } from "@/constants/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import NetworkImage from "@/components/networkImage/NetworkImage";
import ProfileTile from "@/components/profileTitle/ProfileTitle";
import { API_URL } from "@env";
import { AccountStackParamList } from "../type";
import { StackNavigationProp } from "@react-navigation/stack";

interface Address {
  avatar: string;
  [key: string]: any;
}

interface JwtPayload {
  userId: string;
  exp: number;
}

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AccountStackParamList>>();
  const { userId, setUserId, user, updateUser } = useContext(UserType);
  const [address, setAddress] = useState<Address>({ avatar: "" });

  const handleAvatarPress = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Denied",
          "Please allow access to the media library."
        );
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

        // Upload image to Cloudinary
        const formData = new FormData();
        const fetchResponse = await fetch(imageUri);
        const blob = await fetchResponse.blob();
        formData.append("file", blob, "avatar.jpg");
        formData.append(
          "upload_preset",
          process.env.CLOUDINARY_UPLOAD_PRESET as string
        );

        const uploadResponse = await axios.post(
          process.env.CLOUDINARY_UPLOAD_URL as string,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const avatarUrl = uploadResponse.data.secure_url;

        setAddress({ ...address, avatar: avatarUrl });
        await updateAddressData({ ...address, avatar: avatarUrl });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const updateAddressData = async (updatedData: Address) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Token not found");

      const decodedToken: JwtPayload = jwtDecode(token);

      await axios.put(`${API_URL}/address/${decodedToken.userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchAddressData(decodedToken.userId);
    } catch (error) {
      console.error("Error updating address data", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Logout Error", "An error occurred while logging out.");
    }
  };

  const fetchAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Token not found");
  
      const decodedToken: JwtPayload = jwtDecode(token); // Use jwtDecode instead of jwt_decode
  
      if (!decodedToken.userId) {
        throw new Error("Invalid token structure: userId missing");
      }
  
      setUserId(decodedToken.userId); // Assuming setUserId is a function from context
      await fetchAddressData(decodedToken.userId);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching address", error.message);
      } else {
        console.error("Error fetching address", error);
      }
      Alert.alert("Error", "Unable to fetch address. Please try again.");
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
    } catch (error) {
      console.error("Error fetching address data", error);
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
                    <NetworkImage
                      source={user?.avatar}
                      width={100}
                      height={100}
                      radius={99}
                    />
                  ) : (
                    <Image
                      source={require("@/assets/img/default-profile.png")}
                      style={styles.avatarPlaceholder}
                    />
                  )}
                </TouchableOpacity>
                <View style={styles.userDetails}>
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
            <View style={styles.section}>
              <ProfileTile title="Id khách hàng" icon="user" font={3} />
              <ProfileTile title="Tình trạng" icon="bar-chart" font={3} />
              <ProfileTile
                title="Thay đổi mật khẩu"
                icon="lock-closed-outline"
                font={1}
                onPress={() => navigation.navigate("ChangePassword")}
              />
              <ProfileTile
                title="Lịch sử giao dịch"
                icon="sticker-text-outline"
                font={4}
                onPress={() => navigation.navigate("HistoryOrder")}
              />
            </View>
            <View style={styles.subSection}>
              <ProfileTile
                title="Yêu thích"
                icon="heart"
                font={2}
                onPress={() => navigation.navigate("Favourite")}
              />
              <ProfileTile title="Hoạt động gần đây" icon="clock"font={3} />
            </View>
            <View style={styles.subSection}>
              <ProfileTile
                title="Chat"
                icon="chatbox-outline"
                font={1}
                onPress={() => navigation.navigate("Chat")}
              />
              <ProfileTile
                title="Mời bạn bè"
                icon="user"
                font={2}
                onPress={() => navigation.navigate("BottomSheet")}
              />
              <ProfileTile
                title="Setting"
                icon="settings-outline"
                font={1}
                onPress={() => navigation.navigate("Privacy")}
              />
            </View>
            <View style={styles.logoutSection}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}>Copyright 2024 by PCP & TLAK & DDC</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 99,
  },
  userDetails: {
    marginLeft: 10,
    marginTop: 30,
  },
  text: {
    fontSize: 17,
    fontFamily: "bold",
    color: COLORS.black,
  },
  email: {
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
  section: {
    height: 210,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 12,
  },
  subSection: {
    height: 100,
    backgroundColor: COLORS.lightWhite,
    margin: 2,
    borderRadius: 12,
  },
  logoutSection: {
    alignItems: "center",
    marginTop: 20,
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
  footerText: {
    color: "#6C6C6C",
    marginTop: 20,
  },
});

export default AccountScreen;
