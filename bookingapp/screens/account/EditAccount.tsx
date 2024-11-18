import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "@/userContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import ProfileTile from "@/components/profileTitle/ProfileTitle";
import NetworkImage from "@/components/networkImage/NetworkImage";
import { Ionicons } from "@expo/vector-icons";

interface User {
  name: string;
  avatar: string | null;
  mobileNo: string;
  street: string;
  city: string;
  occupation: string;
  gender: string;
  dateOfBirth: string;
  email: string;
}

const AddressScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [userData, setUserData] = useState<User>({
    name: "",
    avatar: null,
    mobileNo: "",
    street: "",
    city: "",
    occupation: "",
    gender: "",
    dateOfBirth: "",
    email: "",
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const decodedToken: any = jwt_decode(token);
        setUserId(decodedToken.userId);
        fetchUserData(decodedToken.userId);
      }
    };
    fetchUser();
  }, [setUserId]);

  const fetchUserData = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/address/${id}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUpdateAddress = () => {
    axios
      .put(`${API_URL}/address/${userId}`, userData)
      .then(() => {
        Alert.alert("Success", "Address updated successfully");
        fetchUserData(userId);
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to update address");
        console.error("Error updating address:", error);
      });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <TouchableOpacity>
          {userData.avatar ? (
            <>
              <NetworkImage
                source={userData.avatar}
                width={70}
                height={70}
                radius={99}
              />
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera-outline" size={20} color="black" />
              </View>
            </>
          ) : (
            <Image
              source={require("@/assets/img/default-profile.png")}
              style={styles.defaultProfileImage}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <ProfileTile
          title="Tên người dùng"
          temp={userData.name}
          icon="edit-3"
          font={3}
        />
        <ProfileTile title="Tình trạng" icon="bar-chart" font={3} />
      </View>
      <View style={styles.divider} />
      <View>
        <ProfileTile
          title="Số điện thoại"
          temp={userData.mobileNo}
          icon="phone"
          font={3}
        />
        <ProfileTile
          title="Nghề nghiệp"
          temp={userData.occupation}
          icon="shopping-bag"
          font={3}
        />
        <ProfileTile
          title="Email"
          temp={userData.email}
          icon="email-edit-outline"
          font={4}
        />
        <ProfileTile
          title="Giới tính"
          temp={userData.gender}
          icon="gender-male-female"
          font={4}
        />
        <ProfileTile
          title="Ngày sinh"
          temp={formatDate(userData.dateOfBirth)}
          icon="cake-variant-outline"
          font={4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  profile: {
    alignItems: "center",
  },
  cameraIconContainer: {
    position: "absolute",
    backgroundColor: "#ccc",
    borderRadius: 50,
    bottom: -3,
    right: 0,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 99,
  },
  section: {
    marginTop: 10,
  },
  divider: {
    backgroundColor: "#EAEAEA",
    height: 10,
    width: "100%",
  },
});

export default AddressScreen;
