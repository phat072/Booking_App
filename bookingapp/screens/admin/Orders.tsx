import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { API_URL } from "@env";
import SearchBar from "../../components/SearchBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Order {
  _id: string;
  date: string;
  status: string;
  restaurant: string;
  user: string;
  note: string;
}

interface User {
  name: string;
}

interface Restaurant {
  name: string;
  image: string;
}

interface RootStackParamList {
  DetailOrders: { order: Order; users: Record<string, User>; restaurants: Record<string, Restaurant> };
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>({});
  const [users, setUsers] = useState<Record<string, User>>({});
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);

        const restaurantIds = Array.from(new Set(data.orders.map((order: Order) => order.restaurant)));

        const restaurantPromises = restaurantIds.map(async (restaurantId) => {
          try {
            const restaurantResponse = await fetch(`${API_URL}/restaurants/${restaurantId}`);
            const restaurantData = await restaurantResponse.json();

            if (restaurantResponse.ok) {
              setRestaurants((prevRestaurants) => ({
                ...prevRestaurants,
                [restaurantId]: restaurantData.restaurant,
              }));
            }
          } catch (error) {
            // Ignore error
          }
        });

        const userPromises = data.orders.map(async (order: Order) => {
          try {
            const userResponse = await fetch(`${API_URL}/address/${order.user}`);
            const userData = await userResponse.json();

            if (userResponse.ok) {
              setUsers((prevUsers) => ({
                ...prevUsers,
                [order.user]: userData,
              }));
            }
          } catch (error) {
            // Ignore error
          }
        });

        await Promise.all(userPromises);
        await Promise.all(restaurantPromises);
      }
    } catch (error) {
      // Ignore error
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });

    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateString: string) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.status.toLowerCase();
    const customerName = users[order.user]?.name.toLowerCase() || "";
    const restaurantName = restaurants[order.restaurant]?.name.toLowerCase() || "";
    const searchTerm = searchPhrase.toLowerCase();

    return (
      orderStatus.includes(searchTerm) ||
      restaurantName.includes(searchTerm) ||
      customerName.includes(searchTerm)
    );
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F8F8F9" }}>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
      />
      <View style={{ marginTop: 10 }}>
        {filteredOrders.map((order) => (
          <View
            key={order._id}
            style={{
              backgroundColor: "#FFFFFF",
              padding: 10,
              borderWidth: 1,
              borderColor: "#DEDEDE",
              borderRadius: 5,
              marginTop: 5,
              marginRight: 5,
              marginLeft: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                paddingBottom: 10,
              }}
            >
              <View style={{ marginRight: 10 }}>
                {restaurants[order.restaurant] && (
                  <Image
                    source={{
                      uri: restaurants[order.restaurant].image,
                    }}
                    style={{
                      width: 85,
                      height: 85,
                      borderRadius: 5,
                      objectFit: "cover",
                    }}
                  />
                )}
              </View>
              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "75%" }}>
                  <Text style={{ color: "#A1A1A1" }}>
                    ID: {order._id.substring(0, 11)}
                  </Text>
                  <Text style={{ color: "#A1A1A1" }}>
                    {formatDate(order.date)}
                  </Text>
                </View>
                <Text
                  style={{
                    color: "#262626",
                    fontSize: 17,
                    fontWeight: "bold",
                    marginBottom: 7,
                    marginTop: 7,
                  }}
                >
                  {restaurants[order.restaurant]?.name || "Unknown Restaurant"}
                </Text>
                <Text style={{ color: "#4A4A4A" }}>
                  {users[order.user]?.name}
                </Text>
                <Text style={{ color: "#FF8C00", fontWeight: "bold", marginTop: 5 }}>
                  {order.note}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <Text style={{ fontSize: 16 }}>{order.status}</Text>
              <Text
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: 5,
                  width: 70,
                  borderRadius: 3,
                  textAlign: "center",
                  fontSize: 15,
                }}
                onPress={() =>
                  navigation.navigate("DetailOrders", {
                    order,
                    users,
                    restaurants,
                  })
                }
              >
                Details
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    width: "100%",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "10%",
  },
});

export default Orders;
