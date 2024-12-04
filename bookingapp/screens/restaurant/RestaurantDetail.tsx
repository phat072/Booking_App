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
import Colors from "@/constants/Colors";
import { UserType } from "@/userContext";
import { API_URL } from "@env";

const { width, height } = Dimensions.get("window");

import { StackNavigationProp } from "@react-navigation/stack";
import { OrdersStackParamList } from "@/screens/type";
type RestaurantDetailNavigationProp = StackNavigationProp<OrdersStackParamList, "Order">;

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
      headerTitle: "", // Remove the restaurant name from the header title
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} style={styles.backButton} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={18} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              if (isFavorite) {
                handleRemoveFavoritePress(userId, restaurantId);
              } else {
                handleFavoritePress(userId, restaurantId);
              }
            }} 
            style={styles.roundButton}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? Colors.primary : "#ff08ea"}
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

  const handleFavoritePress = async (userId: string, restaurantId: string) => {
    try {
      const response = await axios.post(`${API_URL}/favorite/${userId}`, {
        restaurantId,  // Pass restaurantId in the body
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

  const handleRemoveFavoritePress = async (userId: string, restaurantId: string) => {
    try {
      const response = await axios.post(`${API_URL}/remove-favorite/${userId}`, {
        restaurantId,  // Pass restaurantId in the body
      });
  
      if (response.status === 200) {
        setIsFavorite(false);  // Update the local state to reflect the removal
        updateUser((prevUser: any) => ({
          ...prevUser,
          favoriteRestaurants: prevUser.favoriteRestaurants.filter(
            (id: string) => id !== restaurantId
          ),
        }));
        Alert.alert("Thông báo", "Nhà hàng đã được loại bỏ khỏi danh sách yêu thích");
      } else {
        console.warn("Error removing from favorites");
      }
    } catch (error) {
      console.error("Error handling remove favorite:", error);
      Alert.alert("Lỗi", "Không thể loại bỏ nhà hàng khỏi danh sách yêu thích");
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
          border={30} radius={0}
        />
        <View style={styles.popupContainer}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.restaurantAddress}>{item.address}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <View style={styles.row}>
                <FontAwesome5 name="door-open" size={20} color="#A0C69D" />
                <Text style={styles.detailText}>Đang mở cửa</Text>
              </View>
              <Text style={styles.truncateText}>
                Gọi món Việt, Buffet nướng hàn quốc
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.row}>
                <AntDesign name="star" size={20} color="gold" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <View style={[styles.row, {marginRight: 65}]}>
                <Ionicons name="location-sharp" size={20} color={Colors.primary} />
                <Text style={styles.detailText}>4.5 km</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
  <View style={styles.menuContainer}>
        <MenuTab item={item} />
  </View>
  <View>
    <Pressable style={styles.bookButtonText} onPress={() => navigation.navigate("Order", { restaurant: item })}>
      <Text style={styles.bookButtonText}>Book</Text>
    </Pressable>
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
    color: Colors.primary,
    textAlign: "center",
    marginTop: 20,
  },
  backButton: {
    marginBottom: 10,
    color: "black"
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 15
  },
  roundButton: {
    width: 27,
    height: 27,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
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
    fontSize: 13,
  },
  detailsContainer: {
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginVertical: 4,
  },
  truncateText: {
    maxWidth: 150,
    overflow: "hidden",
    fontSize: 13,
  },
  ratingText: {
    marginLeft: 5,
  },
  detailText: {
    fontSize: 13
  },
  menuContainer: {
    flex: 1,
    marginTop: 80,
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
    fontSize: 15,
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
  bookButtonText: {
    color: "#ffffff",          
    fontSize: 18,        
    textAlign: "center",     
    backgroundColor: Colors.primary,
    height: 45,             
    justifyContent: 'center',
    borderRadius: 5,        
    fontWeight: "bold",     
    marginTop: 20,           
  },
});

export default RestaurantDetail;
