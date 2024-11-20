import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "@/userContext";
import { API_URL } from "@env";
import axios from "axios";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { AdminStackParamList } from "../type"; // Update with your file path
import { StackNavigationProp } from "@react-navigation/stack";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  distance: number;
}

type FavouriteScreenNavigationProp = StackNavigationProp<
   AdminStackParamList,
  "Restaurants"
>;

const FavouriteScreen: React.FC = () => {
  const { user } = useContext(UserType);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>(
    []
  );
  const navigation = useNavigation<FavouriteScreenNavigationProp>();

  useEffect(() => {
    axios
      .get(`${API_URL}/${user._id}/favoriteRestaurants`)
      .then((response) => {
        setFavoriteRestaurants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching favorite restaurants:", error);
      });
  }, [user._id]);

  const removeFromFavorites = async (restaurantId: string) => {
    try {
      const response = await axios.post(`${API_URL}/removeFromFavorites`, {
        userId: user._id,
        restaurantId: restaurantId,
      });

      if (response.status === 200) {
        setFavoriteRestaurants((prevFavorites) =>
          prevFavorites.filter((r) => r._id !== restaurantId)
        );
      } else {
        console.error("Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const rightSwipeActions = (restaurantId: string) => (
    <View style={styles.rightSwipeContainer}>
      <TouchableOpacity onPress={() => removeFromFavorites(restaurantId)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView>
      {favoriteRestaurants.map((restaurant) => (
        <Swipeable
          key={restaurant._id}
          renderRightActions={() => rightSwipeActions(restaurant._id)}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Restaurants", { ...restaurant })
            }
          >
            <View style={styles.cardContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.image}
                />
                <View style={styles.ratingDistanceContainer}>
                  <View style={styles.row}>
                    <AntDesign name="star" size={24} color="#DDBC37" />
                    <Text style={styles.text}>{restaurant.rating} |</Text>
                  </View>
                  <View style={styles.row}>
                    <Entypo name="map" size={24} color="#3D9DC3" />
                    <Text style={styles.text}>{restaurant.distance} Km</Text>
                  </View>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.address}>{restaurant.address}</Text>
                <Text style={styles.reservationText}>Đặt bàn giữ chỗ</Text>
                <Text style={styles.diningText}>Gọi món nhậu</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity>
                    <Text style={styles.buttonText}>Đặt chỗ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      ))}
    </ScrollView>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 8,
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    flex: 2,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  ratingDistanceContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 5,
    fontSize: 14,
  },
  infoContainer: {
    flex: 3,
    marginLeft: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  reservationText: {
    fontSize: 14,
    color: "#E34B40",
    fontWeight: "600",
    marginTop: 4,
  },
  diningText: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#A2A2A2",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 14,
  },
  rightSwipeContainer: {
    backgroundColor: "#ff8303",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  deleteText: {
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
});
