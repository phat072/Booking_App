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
import  jwt_decode  from "jwt-decode";
import { COLORS, SIZES } from "@/constants/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import NetworkImage from "@/components/networkImage/NetworkImage";
import ProfileTile from "@/components/profileTitle/ProfileTitle";
import { API_URL } from "@env";
import { AccountStackParamList } from "../type";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "@/constants/Colors";

interface Address {
  avatar?: string;
}

interface User {
  name?: string;
  mobileNo?: string;
  avatar?: string;
}

interface DecodedToken {
  userId: string;
}

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AccountStackParamList>>();
  const { userId, setUserId, user, updateUser } = useContext(UserType);
  const [address, setAddress] = useState<Address>({});

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
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name: "avatar.jpg",
        } as any); // Explicitly cast to `any` to avoid type issues
        formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

        const response = await axios.post(process.env.CLOUDINARY_UPLOAD_URL!, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const avatarUrl = response.data.secure_url;

        setAddress({ ...address, avatar: imageUri });
        await updateAddressData({ ...address, avatar: avatarUrl });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const updateAddressData = async (updatedData: Address) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const decodedToken = jwt_decode(token) as DecodedToken;
      
      const userId = decodedToken.userId;
      await axios.put(`${API_URL}/address/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchAddressData(userId);
    } catch (error) {
      console.error("Error updating address data", error);
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
      if (!token) return;

      const decodedToken = jwt_decode(token) as DecodedToken;
      const userId = decodedToken.userId;
      setUserId(userId);
      await fetchAddressData(userId);
    } catch (error) {
      console.error("Error fetching address", error);
    }
  };

  const fetchAddressData = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/address/${userId}`, {
        timeout: 5000, // Thêm timeout để kiểm tra phản hồi
      });
      const addressData = response.data;
      updateUser(addressData);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.status, error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tài khoản</Text>
      </View>
      <ScrollView>
        <View style={{ backgroundColor: '#fffff', height: 790 }}>
          <View style={{ backgroundColor: '#fffff', height: 690 }}>
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
              <ProfileTile 
                title="ID khách hàng" 
                icon="user" 
                font={3}
                onPress={() => navigation.navigate("EditAccount")}
                 />
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
            <View style={styles.subSection1}>
              <ProfileTile
                title="Chat"
                icon="chatbox-outline"
                font={1}
                onPress={() => navigation.navigate("Chats")}
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
  titleContainer: {
    backgroundColor: Colors.primary, // Màu nền đỏ cho container title
    paddingVertical: 20,    // Điều chỉnh padding cho chiều dọc
    alignItems: "center",   // Căn giữa theo chiều ngang
    justifyContent: "center", // Căn giữa theo chiều dọc
    width: "100%",          // Chiều rộng đầy đủ
    marginBottom: 0,        // Loại bỏ khoảng cách dưới tiêu đề
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff", // Màu chữ trắng
  },
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
    margin: 10,
  },
  section: {
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  subSection: {
    height: 100,
    backgroundColor: "#ffffff",
    margin: 2,
    borderRadius: 12,
  },
  subSection1: {
    height: 150,
    backgroundColor: "#ffffff",
    margin: 2,
    borderRadius: 12,
  },
  logoutSection: {
    alignItems: "center",
    marginTop: 25,  // Tăng khoảng cách trên cho logout section
    paddingBottom: 60, // Tăng thêm padding dưới để không bị cắt dòng footer
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    width: "60%",
    marginTop: 20, // Giảm khoảng cách trên của logout button để tránh bị cắt
  },
  logoutButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  footerText: {
    color: "#6C6C6C",
    marginTop: 20,
    marginBottom: 20, // Thêm margin dưới để cách dòng copyright không bị sát
  },
});

export default AccountScreen;

