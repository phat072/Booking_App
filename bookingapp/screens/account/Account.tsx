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
import { UserType } from "../../userContext";
import jwt_decode from "jwt-decode";
import { COLORS, SIZES } from "../../constants/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import NetworkImage from "../../components/networkImage/NetworkImage";
import ProfileTile from "../../components/profileTitle/profileTitle";
import { API_URL } from "@env";

// Định nghĩa kiểu cho address
type AddressType = {
  avatar?: string;
  [key: string]: any; // Cho phép các thuộc tính khác
};

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { userId, setUserId, user, updateUser } = useContext(UserType);
  const [address, setAddress] = useState<AddressType>({});

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

        // Upload image to Cloudinary
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as unknown as Blob);
        formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || '');

        const response = await axios.post(process.env.CLOUDINARY_UPLOAD_URL || '', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const avatarUrl = response.data.secure_url;

        setAddress((prevAddress) => ({ ...prevAddress, avatar: avatarUrl }));
        await updateAddressData({ ...address, avatar: avatarUrl });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const updateAddressData = async (updatedData: AddressType) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }
      const decodedToken: any = jwt_decode(token);
      const userId = decodedToken.userId;

      await axios.put(`${API_URL}/address/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Nếu dữ liệu cập nhật thành công, bạn có thể cập nhật lại addressData
      await fetchAddressData(userId);
    } catch (error) {
      console.log("Error updating address data", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Logout Error", "An error occurred while logging out.");
    }
  };

  const fetchAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }
      const decodedToken: any = jwt_decode(token);
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
      console.log("Error fetching address data", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.offwhite }}>
      <ScrollView>
        <View style={{ height: SIZES.height - 170 }}>
          <View style={styles.profile}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={handleAvatarPress}>
                {user?.avatar ? (
                  <NetworkImage
                    source={{ uri: user.avatar }}
                    width={100}
                    height={100}
                    radius={99}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/icon.png")}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 99,
                    }}
                  />
                )}
              </TouchableOpacity>
              <View style={{ marginLeft: 10, marginTop: 30 }}>
                <Text style={styles.text}>{user?.name}</Text>
                <Text style={styles.email}>{user?.mobileNo}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("EditAccount")}>
              <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tileContainer}>
            <ProfileTile title={"Id khách hàng"} icon={"user"} font={3} />
            <ProfileTile title={"Tình trạng"} icon={"bar-chart"} font={3} />
            <ProfileTile
              title={"Thay đổi mật khẩu"}
              icon={"lock"}
              onPress={() => navigation.navigate("ChangePassword")}
            />
            <ProfileTile
              title={"Lịch sử giao dịch"}
              icon={"sticker-text-outline"}
              font={4}
              onPress={() => navigation.navigate("HistoryOrder")}
            />
          </View>
          
          <View style={styles.experienceContainer}>
            <Text style={styles.experienceText}>Trải nghiệm</Text>
          </View>

          <View style={styles.tileContainer}>
            <ProfileTile
              title={"Yêu thích"}
              icon={"heart"}
              font={2}
              onPress={() => navigation.navigate("Favourite")}
            />
            <ProfileTile title={"Hoạt động gần đây"} icon={"clockcircleo"} />
          </View>

          <View style={styles.settingsContainer}>
            <Text style={styles.settingsText}>Cài đặt</Text>
          </View>

          <View style={styles.tileContainer}>
            <ProfileTile
              title={"Chat"}
              icon={"chatbox-outline"}
              font={1}
              onPress={() => navigation.navigate("Chat")}
            />
            <ProfileTile
              title={"Mời bạn bè"}
              icon={"adduser"}
              onPress={() => navigation.navigate("BottomSheet")}
            />
            <ProfileTile
              title={"Setting"}
              icon={"settings-outline"}
              font={1}
              onPress={() => navigation.navigate("Privacy")}
            />
          </View>

          <View style={styles.logoutContainer}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
            <Text style={styles.copyrightText}>
              Copyright 2023 by NHK & NTH
            </Text>
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
  profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#6C6C6C",
  },
  tileContainer: {
    height: 210,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 12,
    marginVertical: 10,
  },
  experienceContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  experienceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6E6E6E",
  },
  settingsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6E6E6E",
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  copyrightText: {
    color: "#6C6C6C",
    marginTop: 20,
  },
});

export default AccountScreen;
