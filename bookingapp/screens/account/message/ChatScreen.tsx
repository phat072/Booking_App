import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { UserType } from '@/userContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import Chat from '@/components/chat/Chat';
import { API_URL } from "@env";
import { ChatNavigationProp } from "../../type";

interface Request {
  from: {
    _id: string;
    image: string;
    name: string;
  };
  message: string;
}

interface Chat {
  _id: string;
  name: string;
  lastMessage: string;
  image: string;
}

const ChatScreen: React.FC = () => {
  const [options, setOptions] = useState<string[]>(['Chat']);
  const [chats, setChats] = useState<Chat[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const { setToken, setUserId, userId } = useContext(UserType);
  const navigation = useNavigation<ChatNavigationProp>();

  const chooseOption = (option: string) => {
    console.log("Clicked option:", option);
    setOptions(prevOptions => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter(c => c !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  const changetoaccount = () => {
    navigation.navigate('AccountTab');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken: any = jwt_decode(token || '');
      setToken(token || '');
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      getRequests();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);

  const getRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests/${userId}`);
      setRequests(response.data);
    } catch (error) {
      console.log('Error fetching requests', error);
    }
  };

  const acceptRequest = async (requestId: string) => {
    console.log('Accepting request for:', requestId); 
    try {
      const response = await axios.post(`${API_URL}/request/accept`, {
        userId: userId,
        requestId: requestId,
      });

      if (response.status === 200) {
        await getRequests();
      }
    } catch (error) {
      console.log('Error accepting request', error);
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      setChats(response.data);
    } catch (error) {
      console.log('Error fetching user', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Back Button */}
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={26} color="black" />
        </Pressable>

        <Pressable onPress={changetoaccount}>
          <Image
            style={styles.profileImage}
            source={{
              uri: 'https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/468882816_4869318963293503_3408578698215792344_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1Arg1VKA_6EQ7kNvgGxLNm9&_nc_zt=23&_nc_ht=scontent.fhan4-6.fna&_nc_gid=A-7vKKpsuzvrWmlpvi31F6p&oh=00_AYDZ5feGe_1OBxP1aFeb9a5WKzoX5NqMrSA7PPFS-0sypA&oe=6754FAC6',
            }}
          />
        </Pressable>

        <Text style={styles.title}>Chats</Text>

        <View style={styles.headerIcons}>
          <AntDesign name="camerao" size={26} color="black" />
          <MaterialIcons
            onPress={() => navigation.navigate('People')}
            name="person-outline"
            size={26}
            color="black"
          />
        </View>
      </View>

      <View style={styles.content}>
      <Pressable onPress={() => chooseOption('Chats')} style={styles.optionHeader}>
          <Text>Chats</Text>
          <Entypo name="chevron-small-down" size={26} color="black" />
      </Pressable>
        {options.includes('Chats') && chats.length > 0 ? (
          <View>
            {chats.map((item) => {
              console.log('item', item);
              return <Chat key={item?._id} item={item} />;
            })}
          </View>
        ) : (
          <View style={styles.noChats}>
            <Text style={styles.noChatsText}>No Chats yet</Text>
            <Text style={styles.noChatsSubText}>Get started by messaging a friend</Text>
          </View>
        )}

        <Pressable
          onPress={() => chooseOption('Requests')}
          style={styles.optionHeader}
        >
          <Text>Requests</Text>
          <Entypo name="chevron-small-down" size={26} color="black" />
        </Pressable>

        {options.includes('Requests') && (
          <View style={styles.requestsContainer}>
            <Text style={styles.requestsTitle}>Checkout all the requests</Text>
            {requests.map((item, index) => (
              <Pressable key={`${item.from._id}-${index}`} style={styles.requestItem}>
                <Image source={{ uri: item.from.image }} style={styles.requestImage} />
                <View style={styles.requestDetails}>
                  <Text style={styles.requestName}>{item.from.name}</Text>
                  <Text style={styles.requestMessage}>{item.message}</Text>
                </View>
                <Pressable onPress={() => acceptRequest(item.from._id)} style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </Pressable>
                <AntDesign name="delete" size={26} color="red" />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  content: {
    padding: 10,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noChats: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    textAlign: 'center',
    color: 'gray',
  },
  noChatsSubText: {
    marginTop: 4,
    color: 'gray',
  },
  requestsContainer: {
    marginVertical: 12,
  },
  requestsTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  requestItem: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requestImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  requestDetails: {
    flex: 1,
  },
  requestName: {
    fontSize: 15,
    fontWeight: '500',
  },
  requestMessage: {
    marginTop: 4,
    color: 'gray',
  },
  acceptButton: {
    padding: 8,
    backgroundColor: '#005187',
    width: 75,
    borderRadius: 5,
  },
  acceptButtonText: {
    fontSize: 13,
    textAlign: 'center',
    color: 'white',
  },
  backButton:{
    marginRight: 'auto',
  }
});
