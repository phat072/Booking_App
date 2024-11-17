import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { UserType } from "@/userContext";
import { API_URL } from "@env";
import Status from "@/components/menu/Status";
import PopUp from "@/components/menu/Popup";

interface Order {
  _id: string;
  restaurant: string;
  date: string;
  status: string;
  selectedHour: string;
}

interface Restaurant {
  name: string;
  image: string;
}

const HistoryOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>(
    {}
  );
  const { user } = useContext(UserType);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<string>(
    "status"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("Tất cả");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const status = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã tiếp nhận",
    "Hoàn thành",
    "Đã hủy",
  ];
  const services = ["Tất cả", "Đặt chỗ", "Giao hàng", "Tự đến lấy"];

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/${user._id}`);
        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders);
          setFilteredOrders(data.orders);

          const restaurantIds = Array.from(
            new Set(data.orders.map((order: Order) => order.restaurant))
          );
          const restaurantPromises = restaurantIds.map(async (restaurantId) => {
            const restaurantResponse = await fetch(
              `${API_URL}/restaurants/${restaurantId}`
            );
            const restaurantData = await restaurantResponse.json();
            if (restaurantResponse.ok) {
              setRestaurants((prev) => ({
                ...prev,
                [String(restaurantId)]: restaurantData.restaurant,
              }));
            } else {
              console.error(
                "Error fetching restaurant data:",
                restaurantData.message
              );
            }
          });

          await Promise.all(restaurantPromises);
        } else {
          console.error("Error fetching user orders:", data.message);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchUserOrders();
  }, [user._id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === "Tất cả") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  const handleStatusPress = (status: string) => {
    setSelectedStatus(status);
    filterOrdersByStatus(status);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <Status
        onPress={toggleModal}
        onPress1={toggleModal}
        setSelectedContentType={setSelectedContentType}
        selectedStatus={selectedStatus}
      />

      <ScrollView style={styles.scrollContainer}>
        {filteredOrders.map((order) => (
          <View key={order._id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderImageContainer}>
                {restaurants[order.restaurant] && (
                  <Image
                    source={{ uri: restaurants[order.restaurant].image }}
                    style={styles.orderImage}
                  />
                )}
              </View>
              <View style={styles.orderInfo}>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderId}>
                    ID: {order._id.substring(0, 11)}
                  </Text>
                  <Text style={styles.orderDate}>
                    {formatDate(order.date)}
                  </Text>
                </View>
                <Text style={styles.restaurantName}>
                  {restaurants[order.restaurant]?.name || "No restaurant found"}
                </Text>
                <Text style={styles.orderTime}>
                  Thời gian đến: {formatDate(order.date)} {order.selectedHour}
                </Text>
              </View>
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.orderStatus}>{order.status}</Text>
              <Text style={styles.reorderButton}>Đặt lại</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chọn trạng thái</Text>
            <ScrollView style={styles.modalScroll}>
              {selectedContentType === "status" &&
                status.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.statusItem,
                      selectedStatus === item && styles.selectedStatusItem,
                    ]}
                    onPress={() => handleStatusPress(item)}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              {selectedContentType === "services" &&
                services.map((item, index) => (
                  <View key={index} style={styles.statusItem}>
                    <Text>{item}</Text>
                  </View>
                ))}
            </ScrollView>
            <PopUp buttonText="Xác nhận" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HistoryOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F2F2F2",
  },
  scrollContainer: {
    marginTop: 10,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderWidth: 1,
    borderColor: "#DEDEDE",
    borderRadius: 5,
    marginTop: 5,
  },
  orderHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  orderImageContainer: {
    marginRight: 10,
  },
  orderImage: {
    width: 85,
    height: 85,
    borderRadius: 5,
  },
  orderInfo: {
    flex: 1,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderId: {
    color: "#A1A1A1",
  },
  orderDate: {
    color: "#A1A1A1",
  },
  restaurantName: {
    color: "#262626",
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 7,
  },
  orderTime: {
    color: "#4A4A4A",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  orderStatus: {
    fontSize: 14,
  },
  reorderButton: {
    backgroundColor: "red",
    color: "white",
    padding: 5,
    width: 70,
    borderRadius: 3,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalScroll: {
    maxHeight: 200,
  },
  statusItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedStatusItem: {
    backgroundColor: "#e0e0e0",
  },
});
