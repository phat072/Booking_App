import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AccountStackParamList } from "../../type"; // Correct import of your types
import { StackNavigationProp } from "@react-navigation/stack";

// Message and User Types
interface User {
  id: string;
  name: string;
}

interface Message {
  receiverChatID: string;
  senderChatID: string;
  text: string;
  from: string;
}

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AccountStackParamList>>();
  const route = useRoute<any>(); // Use useRoute to access route params
  const  currentUser  = route.params.currentUser; // Access currentUser from route.params
  console.log("currentUser: ", currentUser);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userTo, setUserTo] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setToken(token);
    };
  
    fetchToken();
    const fetchUsersAndConnectSocket = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const firstUserId = data.results[0]?.id || null;
        setUsers(data.results);
        setUserTo(firstUserId);

        const socket = io("http://localhost:8000", {
          query: { chatID: currentUser.id, token },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });

        socket.on("connect_error", (error: any) => {
          console.error("Socket connection error:", error);
        });

        socket.on("receive_message", (message: Message) => {
          if (message.senderChatID === userTo) {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
        });
      } catch (error) {
        console.error("Error fetching users or connecting to socket:", error);
        alert("Error fetching users. Please try again.");
      }
    };

    fetchUsersAndConnectSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentUser.id, token, userTo]);

  const handleChatSwitch = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/messages?userId=${currentUser.user.id}&toId=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setMessages(data || []);
      setUserTo(userId);
    } catch (error) {
      console.error("Error fetching messages:", error);
      alert("Error fetching messages. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!currentMessage.trim() || !userTo) return;

    const message: Message = {
      receiverChatID: userTo,
      senderChatID: currentUser.user.id,
      text: currentMessage,
      from: currentUser.user.name,
    };

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        setMessages((prevMessages) => [...prevMessages, message]);
        setCurrentMessage("");
        socketRef.current?.emit("send_message", message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat App</Text>
        <View style={styles.headerButtons}>
          <Button
            title="Annotations"
            onPress={() => navigation.navigate("Annotations")}
          />
          <Button
            title="Logout"
            onPress={() => {
              AsyncStorage.clear();
              navigation.replace("Login");
            }}
          />
        </View>
      </View>

      {/* User List */}
      <View style={styles.sidebar}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => handleChatSwitch(item.id)}
            >
              <Text style={styles.userName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Chat Messages */}
      <View style={styles.messagesContainer}>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.senderChatID === currentUser.user.id
                  ? styles.ours
                  : styles.theirs,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageSender}>{item.from}</Text>
            </View>
          )}
        />
      </View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={currentMessage}
          onChangeText={(text) => setCurrentMessage(text)}
          onSubmitEditing={handleSubmit}
        />
        <Button title="Send" onPress={handleSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerButtons: { flexDirection: "row", gap: 10 },
  sidebar: { width: "25%", backgroundColor: "#eee", padding: 10 },
  userItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  userName: { fontSize: 16 },
  messagesContainer: { flex: 1, padding: 10 },
  messageBubble: { padding: 10, borderRadius: 10, marginBottom: 5 },
  ours: { alignSelf: "flex-end", backgroundColor: "#d1f5d3" },
  theirs: { alignSelf: "flex-start", backgroundColor: "#f0f0f0" },
  messageText: { fontSize: 16 },
  messageSender: { fontSize: 12, color: "#888" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10 },
});

export default ChatScreen;
