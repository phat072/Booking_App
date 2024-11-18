import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { API_URL } from "@env";
import SearchBar from "@/components/search/SearchBar";
import { useNavigation, useRoute } from "@react-navigation/native";

// Type Definitions
interface Order {
  _id: string;
  user: string;
  restaurant: string;
  status: string;
  note: string;
  date: string;
  adults: number;
  children: number;
  selectedHour: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  image: string;
  suggestions: {
    items: {
      title: string;
      originalPrice: string;
    }[];
  }[];
}

interface User {
  name: string;
  mobileNo: string;
  email: string;
}


import { StackNavigationProp } from '@react-navigation/stack';
import { OrdersStackParamList } from "@/screens/type";
type OrdersScreenNavigationProp = StackNavigationProp<
OrdersStackParamList,
  'Orders'
>;

const Orders = () => {
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<{ [key: string]: Restaurant }>({});
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [searchPhrase, setSearchPhrase] = useState("");
  const [loading, setLoading] = useState(true); 

  const route = useRoute();

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();
  
      if (response.ok) {
        setOrders(data.orders);
  
        const restaurantIds = Array.from(
          new Set(data.orders.map((order: { restaurant: any; }) => order.restaurant))
        );
  
        const restaurantPromises = restaurantIds.map(async (restaurantId) => {
          try {
            const restaurantResponse = await fetch(
              `${API_URL}/restaurants/${restaurantId}`
            );
            const restaurantData = await restaurantResponse.json();
  
            if (restaurantResponse.ok) {
              setRestaurants((prevRestaurants) => ({
                ...prevRestaurants,
                [String(restaurantId)]: restaurantData.restaurant,
              }));
            }
          } catch (error) {
            // Bỏ qua lỗi, không cần báo lỗi
          }
        });
  
        const userPromises = data.orders.map(async (order: { user: any; }) => {
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
            // Bỏ qua lỗi, không cần báo lỗi
          }
        });
  
        await Promise.all(userPromises);
        await Promise.all(restaurantPromises);
      } else {
        // Bỏ qua lỗi, không cần báo lỗi
      }
    } catch (error) {
      // Bỏ qua lỗi, không cần báo lỗi
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });

    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.status.toLowerCase();
    const customerName = users[order.user]?.name.toLowerCase();
    const restaurantName = restaurants[order.restaurant]?.name.toLowerCase();
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
      <View className="mt-2">
        {filteredOrders.map((order: Order) => (
          <View key={order._id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View className="mr-3">
                {restaurants[order.restaurant] && (
                  <Image
                    source={{
                      uri: restaurants[order.restaurant].image,
                    }}
                    style={styles.restaurantImage}
                  />
                )}
              </View>
              <View className="flex-column">
                <View className="flex-row justify-between w-3/4">
                  <Text style={{ color: "#A1A1A1" }}>
                    ID : {order._id.substring(0, 11)}
                  </Text>
                  <Text style={{ color: "#A1A1A1" }}>
                    {formatDate(order.date)}
                  </Text>
                </View>
                <Text style={styles.restaurantName}>
                  {restaurants[order.restaurant]?.name || "khong co nha hang"}
                </Text>
                <Text style={{ color: "#4A4A4A" }}>
                  {users[order.user]?.name}
                </Text>
                <Text style={styles.noteText}>{order.note}</Text>
              </View>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-base">{order.status}</Text>
              <Text
                style={styles.detailsButton}
                onPress={() =>
                  navigation.navigate("DetailOrders", {
                    order: {
                      _id: order._id,
                      status: order.status,
                      restaurant: order.restaurant,
                      adults: order.adults,
                      children: order.children,
                      date: order.date,
                      selectedHour: order.selectedHour,
                      note: order.note,
                      user: order.user,
                    },
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
  orderCard: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderWidth: 1,
    borderColor: "#DEDEDE",
    borderRadius: 5,
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
  },
  orderHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  restaurantImage: {
    width: 85,
    height: 85,
    borderRadius: 5,
    objectFit: "cover",
  },
  restaurantName: {
    color: "#262626",
    fontSize: 17,
    fontWeight: "bold",
  },
  noteText: {
    color: "#999",
    fontSize: 14,
  },
  detailsButton: {
    color: "#00A4F1",
    fontWeight: "bold",
  },
});

export default Orders;
