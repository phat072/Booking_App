import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '@/userContext';
import { API_URL } from "@env";
import axios from 'axios';
import { ChatNavigationProp } from "../type";

interface ChatProps {
  item: {
    _id: string;
    name: string;
    image: string;
  };
}

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
}

const Chat: React.FC<ChatProps> = ({ item }) => {
  const navigation = useNavigation<ChatNavigationProp>();
  const { user } = useContext(UserType);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userId = user?._id;
  const friendId = item?._id;
  const fetchMessages = async () => {
    try {
      const senderId = userId;
      const receiverId = item?._id;

      setLoading(true);
      const response = await axios.get(`${API_URL}/messages`, {
        params: { senderId, receiverId }, 
      });

      setMessages(response.data);
      console.log(response.data);
    } catch (error) {
      setError("Failed to fetch messages");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log("messages",messages)
  useEffect(() => {
    fetchMessages();
  }, []);

  const getLastMessage = (): Message | undefined => {
    const n = messages.length;
    return n > 0 ? messages[n - 1] : undefined;
  };

  const lastMessage = getLastMessage();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('ChatRoom', {
          name: item?.name,
          receiverId: item?._id,
          image: item?.image,
        })
      }
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Pressable>
          <Image source={{ uri: item?.image }} style={styles.image} />
        </Pressable>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.lastMessage}>
            {loading ? (
              "Loading..."
            ) : error ? (
              error
            ) : lastMessage ? (
              lastMessage.message
            ) : (
              `Start chat with ${item?.name}`
            )}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
  },
  lastMessage: {
    marginTop: 4,
    color: 'gray',
  },
});
