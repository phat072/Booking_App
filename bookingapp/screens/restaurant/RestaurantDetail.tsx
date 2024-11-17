import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import MenuTab from "./Menutab";
import NetworkImage from "@/components/networkImage/NetworkImage";
import PopUp from "@/components/menu/Popup";
import Colors from "@/constants/Colors";
import { UserType } from "@/userContext";
import { API_URL } from "@env";

const { width, height } = Dimensions.get("window");

import { StackNavigationProp } from "@react-navigation/stack";
import { AdminStackParamList } from "@/screens/type";
type RestaurantDetailNavigationProp = StackNavigationProp<AdminStackParamList, "Order">;



const RestaurantDetail: React.FC = () => {
  const { params } = useRoute();
  const navigation = useNavigation<RestaurantDetailNavigationProp>();
  const item = params as any; // Replace `any` with your specific type for `params`
  const { name, _id } = item;
  const { user, updateUser } = useContext(UserType);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const restaurantId = item._id;
  const userId = user?._id;

  if (!item || !_id) {
    console.error("Item or _id is undefined in RestaurantDetail");
    return <Text style={styles.errorText}>Error: Item not found</Text>;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>{name}</Text>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={22} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavoritePress} style={styles.roundButton}>
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
          updateUser((prevUser: any) => ({
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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View>
        <NetworkImage
          source={item.image}
          height={height / 5.5}
          width={width}
          border={30} radius={0}        />
        <View style={styles.popupContainer}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.restaurantAddress}>{item.address}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <View style={styles.row}>
                <FontAwesome5 name="door-open" size={24} color="#A0C69D" />
                <Text style={styles.detailText}>Đang mở cửa</Text>
              </View>
              <Text style={styles.truncateText}>
                Gọi món Việt, Buffet nướng hàn quốc
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.row}>
                <AntDesign name="star" size={24} color="gold" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="location-sharp" size={24} color="red" />
                <Text style={styles.detailText}>4.5 km</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <MenuTab item={item} />
      </View>
      <View style={styles.footer}>
        <PopUp
          buttonText="Book"
          onPress={() => navigation.navigate("Order", { restaurant: item })}
        />
      </View>

      {/* Custom Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Awesome 🎉</Text>
            <Pressable style={styles.modalCloseButton} onPress={toggleModal}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
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
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000000",
    elevation: 4,
  },
  restaurantName: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  restaurantAddress: {
    textAlign: "center",
    color: "#666",
  },
  detailsContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  truncateText: {
    maxWidth: 150,
    overflow: "hidden",
  },
  ratingText: {
    marginLeft: 5,
  },
  detailText: {
    marginLeft: 10,
  },
  menuContainer: {
    flex: 1,
    marginTop: 80,
  },
  footer: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default RestaurantDetail;
