import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView } from 'react-native';
import { UserType } from '@/userContext';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { useSocketContext } from '@/SocketContext';
import { API_URL } from '@env';

interface Message {
  shouldShake: boolean;
  senderId: string;
  receiverId: string;
  message: string;
  timeStamp: string;
}

interface RouteParams {
  name: string;
  receiverId: string;
}

const ChatRoom: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation();
  const { userId } = useContext(UserType);
  const { socket } = useSocketContext();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text>{route?.params?.name}</Text>
        </View>
      ),
    });
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages`, {
        params: { senderId: userId, receiverId: route?.params?.receiverId },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (senderId: string, receiverId: string) => {
    try {
      await axios.post(`${API_URL}/sendMessage`, { senderId, receiverId, message });

      socket.emit('sendMessage', { senderId, receiverId, message });

      setMessage('');

      setTimeout(() => {
        fetchMessages();
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    socket?.on('newMessage', (newMessage: Message) => {
      newMessage.shouldShake = true;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => socket?.off('newMessage');
  }, [socket, messages]);

  const formatTime = (time: string) => {
    const options = { hour: 'numeric' as const, minute: 'numeric' as const };
    return new Date(time).toLocaleString('en-US', options);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {messages?.map((item, index) => (
          <Pressable
            key={index}
            style={[
              item?.senderId === userId
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item?.message}</Text>
            <Text style={styles.timeText}>{formatTime(item?.timeStamp)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Entypo name="emoji-happy" size={24} color="gray" />
        <TextInput
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />
        <View style={styles.iconsContainer}>
          <Entypo name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable
          onPress={() => sendMessage(userId, route?.params?.receiverId)}
          style={styles.sendButton}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 8,
    maxWidth: '60%',
    borderRadius: 7,
    margin: 10,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    padding: 8,
    margin: 10,
    borderRadius: 7,
    maxWidth: '60%',
  },
  messageText: {
    fontSize: 13,
    textAlign: 'left',
  },
  timeText: {
    textAlign: 'right',
    fontSize: 9,
    color: 'gray',
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: '#0066b2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    textAlign: 'center',
    color: 'white',
  },
});
