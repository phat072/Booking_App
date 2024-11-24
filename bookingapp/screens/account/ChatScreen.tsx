import React, { useState, useCallback, useEffect, useContext } from "react";
import { Bubble, GiftedChat, Time, IMessage } from "react-native-gifted-chat";
import axios from "axios";
import { UserType } from "@/userContext";
import { API_URL } from "@env";

const ChatScreen: React.FC = () => {
  const { user } = useContext(UserType); // Assumes UserType provides the current user
  const [messages, setMessages] = useState<IMessage[]>([]); 
  const recipientId = "VALID_RECIPIENT_ID"; // Replace with dynamic logic for recipient

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/chat/${user._id}`);
        const fetchedMessages = response.data.map((msg: any) => ({
          _id: msg._id,
          text: msg.text,
          createdAt: new Date(msg.createdAt), // Ensure createdAt is a Date object
          user: {
            _id: msg.userId._id,
            name: msg.userId.name,
            avatar:
              msg.userId.avatar ||
              "https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg",
          },
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [user._id]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const newMessage = newMessages[0];
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      try {
        await axios.post(`${API_URL}/api/chat`, {
          userId: user._id,
          text: newMessage.text,
          createdAt: newMessage.createdAt.toISOString(), // ISO format for dates
          recipientId, // Dynamic recipientId
        });
      } catch (error) {
        console.error("Failed to send message:", error.response?.data || error.message);
      }
    },
    [user._id, recipientId]
  );

  const renderTime = (props: any) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: "#3c3c434d",
            fontSize: 10,
            textAlign: "right",
          },
          right: { color: "#3c3c434d", fontSize: 10 },
        }}
        containerStyle={{ left: { alignSelf: "flex-end", flex: 1 } }}
      />
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user._id,
      }}
      scrollToBottom={true}
      inverted={false}
      messagesContainerStyle={{
        backgroundColor: "#FFFFFF",
      }}
      renderTime={renderTime}
      renderBubble={(props) => (
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: "#1C261E",
            },
          }}
          wrapperStyle={{
            right: {
              backgroundColor: "#A2F8B1",
              marginTop: 15,
            },
            left: {
              marginTop: 15,
            },
          }}
        />
      )}
    />
  );
};

export default ChatScreen;
