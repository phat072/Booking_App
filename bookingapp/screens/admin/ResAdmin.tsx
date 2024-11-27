import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { Button } from "@rneui/themed";
import axios from "axios";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from "@/constants/Colors";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
}

export type ResStackParamList = {
  ResAdmin: undefined;  // For ResAdmin screen
  AddRes: undefined;    // For AddRes screen
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const ResAdmin = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const swipeableRef = useRef<Swipeable | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<ResStackParamList>>();

  useEffect(() => {
    fetchAllRestaurants();
  }, [restaurants]);

  const fetchAllRestaurants = async () => {
    try {
      const response = await axios.get(`${API_URL}/restaurants`);
      setRestaurants(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching restaurants");
      setLoading(false);
      console.error("Error fetching restaurants:", error);
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/restaurants/${id}`);
      setRestaurants(restaurants.filter((restaurant) => restaurant._id !== id));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa nhà hàng này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteRestaurant(id),
        },
      ],
      { cancelable: false }
    );
  };

  const renderRightActions = (id: string) => {
    return (
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "...";
    }
    return text;
  };

  const closePreviousSwipe = (id: string) => {
    if (swipedId && swipedId !== id && swipeableRef.current) {
      swipeableRef.current.close();
    }
    setSwipedId(id);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading restaurants...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
        <Button
          buttonStyle={styles.retryButton}
          onPress={fetchAllRestaurants}
          title="Retry"
        />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={restaurants}
        renderItem={({ item }) => (
          <Swipeable
            ref={(ref) => {
              if (swipedId === item._id) swipeableRef.current = ref;
            }}
            onSwipeableWillOpen={() => closePreviousSwipe(item._id)}
            renderRightActions={() => renderRightActions(item._id)}
          >
            <TouchableOpacity style={styles.resContainer}>
              <Image
                source={{ uri: item.image || "https://cdn-icons-png.flaticon.com/512/1376/1376387.png"}}
                style={styles.resImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.resName}>{item.name}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.resAddress}>
                  {truncateText(item.address, 40)}
                </Text>
                <Text style={styles.resRating}>
                  Đánh giá: {item.rating}
                </Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
        keyExtractor={(item) => item._id}
      />
      <Button
        buttonStyle={styles.addButton}
        onPress={() => navigation.navigate("AddRes")}
        radius="md"
        size="lg"
        color="#2DDB6D"
        titleStyle={styles.addButtonTitle}
      >
        Add Restaurants
      </Button>
    </>
  );
};

export default ResAdmin;

const styles = StyleSheet.create({
  resContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 16,
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 12,
    justifyContent: "flex-start",
  },
  resImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  resName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  resAddress: {
    fontSize: 14,
    color: "#8f8a8a",
    marginTop: 4,
  },
  resRating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e67e22",
    marginTop: 6,
  },
  addButton: {
    marginVertical: 20,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addButtonTitle: {
    fontWeight: "600",
    fontSize: 18,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: "#FF6347",
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    width: 100,
    height: "89%",
    borderRadius: 5,
    marginVertical: 8,
    marginRight: 4,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
