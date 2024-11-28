import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "@/constants/Colors";
const RestaurantUI = ({ restaurantData }) => {
  if (
    !restaurantData ||
    !Array.isArray(restaurantData) ||
    restaurantData.length === 0
  ) {
    return <Text style={styles.noDataText}>No restaurant data available.</Text>;
  }
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {restaurantData.map((restaurant) => (
        <TouchableOpacity
          key={restaurant._id}
          onPress={() =>
            navigation.navigate("RestaurantDetail", { ...restaurant })
          }
          style={styles.shadow}
        >
          <View style={styles.card}>
            <Image
              source={{
                uri: restaurant.image || "default_image_url",
              }}
              style={styles.image}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <View style={styles.row}>
                <Ionicons name="location-sharp" size={24} color={Colors.primary} />
                <Text style={styles.address}>{restaurant.address}</Text>
              </View>
              <View style={styles.ratingRow}>
                <View style={styles.rating}>
                  <AntDesign name="star" size={24} color="#DDBC37" />
                  <Text style={styles.ratingText}>{restaurant.rating}</Text>
                </View>
                <View style={styles.distance}>
                  <Entypo name="map" size={24} color="#3D9DC3" />
                  <Text style={styles.distanceText}>4.2 Km</Text>
                </View>
              </View>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity>
                  <Text style={styles.bookButton}>Đặt chỗ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default RestaurantUI;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFBF5",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  shadow: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  infoContainer: {
    width: "65%",
    paddingLeft: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  address: {
    color: "#555",
    marginLeft: 5,
    width: 200,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  distanceText: {
    marginLeft: 5,
  },
  buttonWrapper: {
    marginTop: 10,
  },
  bookButton: {
    width: "50%",
    textAlign: "center",
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#A2A2A2",
    borderRadius: 5,
  },
});
