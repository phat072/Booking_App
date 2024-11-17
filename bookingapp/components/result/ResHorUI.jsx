import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation, RouteProp } from "@react-navigation/native";


const RestaurantUI = ({ restaurantData }) => {
  const navigation = useNavigation();

  if (!restaurantData || restaurantData.length === 0) {
    return <Text style={styles.noDataText}>No restaurant data available.</Text>;
  }

  return (
    <ScrollView style={{ backgroundColor: "#FFFBF5" }}>
      {restaurantData.map((restaurant) => (
        <TouchableOpacity
          key={restaurant._id}
          onPress={() =>
            navigation.navigate("RestaurantDetail", { ...restaurant })
          }
          style={styles.shadow}
        >
          <View style={styles.container}>
            <Image
              source={{ uri: restaurant.image || DEFAULT_IMAGE_URL }}
              style={styles.image}
            />
            <View style={styles.details}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <View style={styles.row}>
                <Ionicons name="location-sharp" size={20} color="red" />
                <Text style={styles.address}>{restaurant.address}</Text>
              </View>
              <View style={styles.row}>
                <AntDesign name="star" size={20} color="#DDBC37" />
                <Text style={styles.rating}>{restaurant.rating}</Text>
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
  shadow: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  container: {
    flexDirection: "row",
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  restaurantName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  address: {
    marginLeft: 8,
    color: "gray",
    flexShrink: 1,
  },
  rating: {
    marginLeft: 5,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
