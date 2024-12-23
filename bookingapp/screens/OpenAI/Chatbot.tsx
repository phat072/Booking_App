import React, { useState, useEffect } from "react";
import { TextInput, Button, Text, View, ScrollView } from "react-native";
import { getGPT4Response } from "./api"; // Thay đổi đường dẫn nếu cần
import { API_URL } from "@env";
// Giả sử API của bạn trả về danh sách nhà hàng
const getRestaurants = async () => {
  try {
    const response = await fetch(`${API_URL}/restaurants`);
    const data = await response.json();
    return data; // Trả về danh sách các nhà hàng
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);

  // Lấy danh sách nhà hàng khi component được mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants();
      setRestaurants(data);
    };
    fetchRestaurants();
  }, []);

  const handleSendMessage = async () => {
    const userMessage = userInput.trim();
    if (!userMessage) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "text", text: userMessage, sender: "user" },
    ]);
    setUserInput(""); // Xóa input field

    try {
      if (userMessage.toLowerCase().includes("giới thiệu nhà hàng")) {
        // Hiển thị danh sách các nhà hàng khi người dùng yêu cầu
        const restaurantList = restaurants
          .map((restaurant: any) => `${restaurant.name} - ${restaurant.address}`)
          .join("\n");

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "text",
            text: `Dưới đây là danh sách nhà hàng bạn có thể tham khảo:\n\n${restaurantList}`,
            sender: "bot",
          },
        ]);
      } else {
        // Trường hợp khác xử lý qua GPT-4
        const response = await getGPT4Response(userMessage);
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
