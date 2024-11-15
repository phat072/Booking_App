import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import MenuTab from "./Menutab";
import NetworkImage from "../../components/networkImage/networkImage";
import { SIZES } from "../../constants/Theme";
import PopUp from "../../components/menu/Popup";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { UserType } from "../../userContext";
import axios from "axios";
import { API_URL } from "@env";

interface MenuItem {
  id: string;
  name: string;
  address: string;
  image: any; // Specify the type based on your image source
  rating: number;
  _id: string;
}


export default function RestaurantDetail() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const item: MenuItem = params as MenuItem;
  const { name, _id } = item;
  const { user, updateUser } = useContext(UserType);

  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const restaurantId = item._id;
  const userId = user?._id;

  if (!item || !_id) {
    console.error("Item or _id is undefined in RestaurantDetail");
    return <Text>Error: Item not found</Text>;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ fontWeight: "bold", fontSize: 18, color: "white" }}
        >
          {name}
        </Text>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={22} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFavoritePress}
            style={styles.roundButton}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "red" : "black"}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [isFavorite]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && user.favoriteRestaurants) {
        setIsFavorite(user.favoriteRestaurants.includes(restaurantId));
      }
    };

    checkFavoriteStatus();
  }, [user, restaurantId]);

  const handleFavoritePress = async () => {
    try {
      const response = await axios.post(`${API_URL}/addToFavorites`, {
        userId,
        restaurantId,
      });

      if (response.status === 200) {
        if (response.data.message === "Restaurant already in favorites") {
          Alert.alert("Thông báo", "Nhà hàng đã có trong danh sách yêu thích");
        } else {
          setIsFavorite(true);
          updateUser((prevUser: { favoriteRestaurants: any; }) => ({
            ...prevUser,
            favoriteRestaurants: [
              ...prevUser.favoriteRestaurants,
              restaurantId,
            ],
          }));
        }
      } else {
        console.warn("Error adding to favorites");
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#ffffff" }}>
        <NetworkImage
          source={item.image}
          height={SIZES.height / 5.5}
          width={SIZES.width}
          border={30} radius={0}        />
        <View style={styles.popupContainer}>
          <Text className="text-center font-bold text-lg">{item.name}</Text>
          <Text className="text-center text-gray-500">{item.address}</Text>
          <View className="flex-column mt-2">
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <FontAwesome5 name="door-open" size={24} color="#A0C69D" />
                <Text className="ml-2">Đang mở cửa</Text>
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.truncateText}
              >
                Gọi món Việt, Buffet nướng hàn quốc
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <View className="flex-row items-center">
                <AntDesign name="star" size={24} color="gold" />
                <Text className="ml-4">{item.rating}</Text>
              </View>
              <View className="flex-row mr-16">
                <Ionicons name="location-sharp" size={24} color="red" />
                <Text className="">4.5 km</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <MenuTab
          item={item}
          handlePresentModalPress={() => setModalVisible(true)}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 5,
          right: 0,
          left: 0,
        }}
      >
        <PopUp
          buttonText="Book"
          onPress={() => {
            navigation.navigate("Order", { restaurant: item });
          }}
        />
      </View>

      {/* Modal for additional details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Awesome 🎉</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  truncateText: {
    maxWidth: 150,
    overflow: "hidden",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.primary,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  applyButton: {
    backgroundColor: "red",
    width: "90%",
    marginTop: 20,
    padding: 17,
    borderRadius: 5,
  },
  applyButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  popupContainer: {
    position: "absolute",
    top: 80,
    backgroundColor: "white",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    padding: 10,
    margin: 10,
    width: "95%",
    height: 145,
    borderRadius: 5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "#000000",
    elevation: 4,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
});

