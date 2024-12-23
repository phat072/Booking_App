import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";

interface Order {
  _id: string;
  restaurant: {
    name: string;
    image: string;
    address: string;
  };
  user: {
    name: string;
  };
  date: string;
  selectedHour: string;
  note: string;
  status: "Chờ xác nhận" | "Đã tiếp nhận" | "Hoàn thành" | "Đã hủy"; // Enum for status
  adults: number;
  children: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
        console.log("Orders fetched successfully", data.orders.length);
      }
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const updateOrderStatus = async (orderId: string, newStatus: "Chờ xác nhận" | "Đã tiếp nhận" | "Hoàn thành" | "Đã hủy") => {
    try {
      const response = await fetch(`${API_URL}/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Error updating order status");
      }
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const renderStatusButtons = (order: Order) => {
    const status = order.status;

    // Define possible transitions based on the current status
    if (status === "Chờ xác nhận") {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => updateOrderStatus(order._id, "Đã tiếp nhận")}
          >
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusButton, styles.cancelButton]}
            onPress={() => updateOrderStatus(order._id, "Đã hủy")}
          >
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (status === "Đã tiếp nhận") {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => updateOrderStatus(order._id, "Hoàn thành")}
          >
            <Text style={styles.buttonText}>Hoàn thành</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusButton, styles.cancelButton]}
            onPress={() => updateOrderStatus(order._id, "Đã hủy")}
          >
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (status === "Hoàn thành") {
      return (
        <Text style={[styles.statusText, styles.completedText]}>Đơn hàng đã hoàn thành</Text>
      );
    }

    if (status === "Đã hủy") {
      return <Text style={[styles.statusText, styles.canceledText]}>Đơn hàng đã bị hủy</Text>;
    }

    return null;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F8F8F9" }}>
      <View style={{ padding: 10 }}>
        {loading ? (
          <Text>Loading orders...</Text>
        ) : (
          orders.map((order) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Image
                  source={{ uri: order.restaurant.image }}
                  style={styles.restaurantImage}
                />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
                  <Text style={styles.restaurantAddress}>{order.restaurant.address}</Text>
                  <Text>{formatDate(order.date)} at {order.selectedHour}</Text>
                  <Text>{order.user.name}</Text>
                  <Text>{order.note || "No note"}</Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{order.status}</Text>
                {renderStatusButtons(order)}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  restaurantAddress: {
    color: "#888",
  },
  statusContainer: {
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  completedText: {
    color: "#28a745",
  },
  canceledText: {
    color: "#dc3545",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Orders;

