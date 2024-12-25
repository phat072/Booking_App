import React, { useState, useEffect } from "react";
import { TextInput, Button, Text, View, ScrollView, Alert } from "react-native";
import { getGPT4Response } from "./api"; // Thay đổi đường dẫn nếu cần
import { API_URL } from "@env"; // Đảm bảo biến môi trường được thiết lập đúng
import * as Location from "expo-location";

// Hàm gọi API để lấy danh sách nhà hàng gần đó
const getNearbyRestaurants = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `${API_URL}/restaurants/nearby?lat=${latitude}&lng=${longitude}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    return [];
  }
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState("");
  const [userLocation, setUserLocation] = useState<any>(null);

  useEffect(() => {
    let locationSubscription: any;

    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Cannot access location services.");
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Cập nhật mỗi 5 giây
            distanceInterval: 10, // Hoặc mỗi khi người dùng di chuyển 10 mét
          },
          (location) => {
            setUserLocation(location.coords);
          }
        );
      } catch (error) {
        Alert.alert("Error", "Could not fetch location.");
      }
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    const userMessage = userInput.trim();
    if (!userMessage) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "text", text: userMessage, sender: "user" },
    ]);
    setUserInput("");

    try {
      if (userMessage.toLowerCase().includes("nhà hàng gần đây")) {
        if (!userLocation) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: "text", text: "Không thể lấy vị trí của bạn.", sender: "bot" },
          ]);
          return;
        }

        const nearbyRestaurants = await getNearbyRestaurants(
          userLocation.latitude,
          userLocation.longitude
        );

        if (nearbyRestaurants.length === 0) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "text",
              text: "Không tìm thấy nhà hàng nào gần bạn.",
              sender: "bot",
            },
          ]);
          return;
        }

        const restaurantList = nearbyRestaurants
          .map((restaurant: any) => `${restaurant.name} - ${restaurant.address}`)
          .join("\n");

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "text",
            text: `Dưới đây là danh sách nhà hàng gần bạn:\n\n${restaurantList}`,
            sender: "bot",
          },
        ]);
      } else {
        const prompt = `Vị trí hiện tại của người dùng: (${userLocation?.latitude}, ${userLocation?.longitude}). Câu hỏi: ${userMessage}`;
        const response = await getGPT4Response(prompt);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "text", text: response, sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "text", text: "Đã xảy ra lỗi. Vui lòng thử lại.", sender: "bot" },
      ]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        Chatbot Giới Thiệu Nhà Hàng
      </Text>

      <ScrollView style={{ flex: 1, marginBottom: 20 }}>
        {messages.map((msg, index) => (
          <View key={index} style={{ alignItems: msg.sender === "bot" ? "flex-start" : "flex-end" }}>
            <Text style={{ padding: 10, backgroundColor: msg.sender === "bot" ? "#f0f0f0" : "#007bff", color: msg.sender === "bot" ? "#000" : "#fff", borderRadius: 5, marginBottom: 10 }}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <TextInput
          style={{
            flex: 1,
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            marginRight: 10,
          }}
          value={userInput}
          onChangeText={(text) => setUserInput(text)}
          placeholder="Hãy nhập yêu cầu của bạn..."
        />
        <Button title="Gửi" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

export default Chatbot;
