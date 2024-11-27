import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
  } from "react-native";
  import { CheckBox, Icon } from "react-native-elements";
  import React, {  useState } from "react";
  import { Feather } from "@expo/vector-icons";
  import { FontAwesome } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  import { FontAwesome5 } from "@expo/vector-icons";
  import { MaterialIcons } from "@expo/vector-icons";
  import { Foundation } from "@expo/vector-icons";
  import { Entypo } from "@expo/vector-icons";
  import { API_URL } from "@env";
  import { OrdersStackParamList } from "@/screens/type";
  import { RouteProp, useRoute } from "@react-navigation/native";
import Colors from "@/constants/Colors";

  type DetailOrdersRouteProp = RouteProp<OrdersStackParamList, "DetailOrders">;

  const DetailOrders = () => {
    const route = useRoute<DetailOrdersRouteProp>();
    const { order, users, restaurants } = route.params;

    console.log(order, "order details");
  
    // console.log(order, "order");
    // console.log(restaurants, "suggest");
    const selectedRestaurant = restaurants[order.restaurant];
  
    const formatDate = (dateString: string | number | Date) => {
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
  
      return new Date(dateString).toLocaleDateString("vi-VN", options);
    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [, setLocalOrderStatus] = useState(order.status);
  
    // console.log(localOrderStatus)
  
    const openModal = () => {
      setIsModalVisible(true);
    };
  
    const closeModal = () => {
      setIsModalVisible(false);
    };
  
    const updateStatus = () => {
      fetch(`${API_URL}/api/orders/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Order updated successfully", data);
          closeModal();
          setLocalOrderStatus(selectedStatus);
        })
        .catch((error) => {
          console.error("Error updating order:", error);
        });
    };
    const statusOptions = [
      "Chờ xác nhận",
      "Đã tiếp nhận",
      "Hoàn thành",
      "Đã hủy",
    ];
    let foodItemsSection = null;
  
    if (
      selectedRestaurant &&
      selectedRestaurant.suggestions &&
      selectedRestaurant.suggestions.length > 0 &&
      selectedRestaurant.suggestions[0].items &&
      selectedRestaurant.suggestions[0].items.length > 0
    ) {
      foodItemsSection = (
        <>
          <View
            style={{ backgroundColor: "#EAEAEA", height: 10, width: "100%" }}
          ></View>
          {selectedRestaurant.suggestions[0].items.map((item: { title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; originalPrice: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
            <View style={{ margin: 15 }} key={index}>
              <Text className="py-4 text-lg font-bold">Món ăn</Text>
              <View className="flex flex-row items-center">
                <View className="w-[80%]">
                  <Text className="text-sm">{item.title}</Text>
                </View>
                <View className="w-[20%]">
                  <Text className="text-base font-bold">
                    {item.originalPrice}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      );
    }
  
    return (
      <ScrollView style={styles.container}>
        {/* THONG TIN DON HANG  */}
  
        <View style={{ margin: 15 }}>
          <Text className="font-medium text-lg py-4">Thông tin đặt bàn: </Text>
  
          <View className="border p-2 flex-row justify-between rounded-xl">
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
            <View className="w-2/3">
              <Text className="text-lg text-gray-950">
                {restaurants[order.restaurant]?.name}
              </Text>
              <Text className="text-gray-500">
                {restaurants[order.restaurant]?.address}
              </Text>
            </View>
          </View>
          <Text className="py-4 text-lg font-medium">Thông tin khách hàng:</Text>
          <View className="flex-row border-b p-4 border-b-zinc-300 items-center">
            <View className="flex-row justify-between  items-center  w-4/12">
              <FontAwesome5 name="user" size={24} color="black" />
              <Text className="ml-0 text-base">Người lớn : </Text>
            </View>
            <Text className="w-8/12 ml-4">{order.adults}</Text>
          </View>
          <View className="flex-row border-b p-4 border-b-zinc-300 items-center">
            <View className="flex-row justify-between items-center w-4/12">
              <MaterialIcons name="child-care" size={24} color="black" />
  
              <Text className="ml-0 text-base">Trẻ em ：</Text>
            </View>
            <Text className="w-8/12 ml-4">{order.children}</Text>
          </View>
          <View className="flex-row border-b p-4 border-b-zinc-300 items-center">
            <View className="flex-row justify-between  items-center  w-5/12">
              <AntDesign name="calendar" size={24} color="black" />
              <Text className="mr-4">Ngày đặt bàn : </Text>
            </View>
            <Text className="w-8/12 ml-4">{formatDate(order.date)}</Text>
          </View>
          <View className="flex-row border-b p-4 border-b-zinc-300 items-center">
            <View className="flex-row justify-between  items-center  w-5/12">
              <AntDesign name="clockcircleo" size={24} color="black" />
              <Text className="mr-4">Giờ đặt bàn : </Text>
            </View>
            <Text className="w-8/12 ml-4">{order.selectedHour}</Text>
          </View>
        </View>
        <View
          style={{ backgroundColor: "#EAEAEA", height: 10, width: "100%" }}
        ></View>
        {/* Tinh trang don hang  */}
        <View
          style={{ backgroundColor: "#EAEAEA", height: 10, width: "100%" }}
        ></View>
        <View style={{ margin: 15, height: 80 }}>
          <Text className="py-4 text-lg font-bold">Order status</Text>
          <View className="flex-row justify-between">
            <Text className="text-lg">Order status: {order.status}</Text>
            <TouchableOpacity onPress={openModal}>
              <Entypo name="pencil" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </View>
        {/* MON AN DI KEM  */}
        <View
          style={{ backgroundColor: "#EAEAEA", height: 10, width: "100%" }}
        ></View>
        {foodItemsSection}
  
        <View
          style={{ backgroundColor: "#EAEAEA", height: 10, width: "100%" }}
        ></View>
  
        {/* THONG TIN KHACH HANG  */}
        <View style={{ margin: 15 }}>
          <Text className="font-bold text-lg py-2">Customers Info</Text>
          <View className="flex-row p-5  items-center">
            <View className="flex-row items-center w-2/4 justify-start">
              <FontAwesome5 name="user-circle" size={24} color="black" />
              <Text className="ml-4 text-base">Name</Text>
            </View>
            <Text className="w-2/4">{users[order.user]?.name}</Text>
          </View>
          <View className="flex-row p-5  items-center">
            <View className="flex-row items-center w-2/4 justify-start">
              <Feather name="phone" size={24} color="black" />
  
              <Text className="ml-4 text-base">Telephone</Text>
            </View>
            <Text className="w-2/4">{users[order.user]?.mobileNo}</Text>
          </View>
          <View className="flex-row p-5  items-center">
            <View className="flex-row items-center w-2/4 justify-start">
              <FontAwesome name="envelope" size={24} color="black" />
              <Text className="ml-4">Email</Text>
            </View>
            <Text className="w-2/4">{users[order.user]?.email}</Text>
          </View>
        </View>
        <View
          style={{ backgroundColor: "#EAEAEA", height: 10, width: "100%" }}
        ></View>
  
        {/* GHI CHU  */}
        <View style={{ margin: 15, height: 80 }}>
          <View className="flex-row p-5  items-center">
            <View className="flex-row w-2/5 h-14 justify-around items-center ">
              <Foundation name="clipboard-notes" size={24} color="black" />
              <Text className="mr-14 text-base">Note</Text>
            </View>
            <View className="w-3/5 h-14">
              <TextInput
                placeholder={order.note}
                className="ml-2 p-2 flex-1 rounded-xl border border-slate-200"
                keyboardType="default"
              />
            </View>
          </View>
        </View>
        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text className="text-xl font-bold p-4 text-center border-b-2 border-b-zinc-300">
                Edit order status
              </Text>
              {statusOptions.map((option, index) => (
                <CheckBox
                  key={index}
                  title={option}
                  textStyle={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "black",
                  }}
                  containerStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#fff",
                  }}
                  checkedIcon={
                    <Icon
                      name="check-box"
                      type="material"
                      color="#34DBA1"
                      size={30}
                      containerStyle={{ marginRight: 10 }}
                    />
                  }
                  uncheckedIcon={
                    <Icon
                      name="check-box-outline-blank"
                      type="material"
                      color="gray"
                      size={30}
                      containerStyle={{ marginRight: 10 }}
                    />
                  }
                  checked={selectedStatus === option}
                  onPress={() => setSelectedStatus(option)}
                />
              ))}
              <TouchableOpacity
                onPress={updateStatus}
                style={{
                  backgroundColor: "#22BFED",
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 17 }}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeModal}
                style={{
                  marginTop: 10,
                  backgroundColor: "#DB4C40",
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 17 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  };
  
  export default DetailOrders;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
  
      backgroundColor: "#fff",
    },
    applyButton: {
      backgroundColor: Colors.primary,
      width: "90%",
      marginTop: 20,
      padding: 17,
      borderRadius: 5,
    },
    applyButtonText: {
      textAlign: "center",
      color: "#fff",
      fontSize: 17,
      fontWeight: "bold",
    },
    popupContainer: {
      backgroundColor: "white",
      borderTopColor: "#ccc",
      borderTopWidth: 1,
      width: "100%",
      height: 120,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
    },
  });