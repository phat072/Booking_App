import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
  } from 'react-native';
  import React, { useContext, useLayoutEffect, useState } from 'react';
  import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
  import { UserType } from '@/userContext';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import Entypo from 'react-native-vector-icons/Entypo';
  import Feather from 'react-native-vector-icons/Feather';
  import axios from 'axios';
  import { API_URL } from '@env';
  
  interface RouteParams {
    receiverId: string;
    name: string;
  }
  
  const RequestChatRoom = () => {
    const navigation = useNavigation();
    const [message, setMessage] = useState<string>('');
    const { token, userId, setToken, setUserId } = useContext(UserType);
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  
    useLayoutEffect(() => {
      return navigation.setOptions({
        headerTitle: '',
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <Ionicons name="arrow-back" size={24} color="black" />
            <View>
              <Text>{route?.params?.name}</Text>
            </View>
          </View>
        ),
      });
    }, [navigation, route?.params?.name]);
  
    console.log('userId', userId);
    console.log('Rec', route?.params?.receiverId);
  
    const sendMessage = async () => {
      try {
        const userData = {
          senderId: userId,
          receiverId: route?.params?.receiverId,
          message: message,
        };
  
        const response = await axios.post(`${API_URL}/request`, userData);
        if (response.status === 200) {
          setMessage('');
          Alert.alert('Your request has been shared', 'Wait for the user to accept your request');
        }
      } catch (error) {
        console.log('error', error);
      }
    };
  
    return (
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView></ScrollView>
        <View style={styles.inputContainer}>
          <Entypo name="emoji-happy" size={24} color="gray" />
  
          <TextInput
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            style={styles.textInput}
          />
  
          <View style={styles.iconContainer}>
            <Entypo name="camera" size={24} color="gray" />
            <Feather name="mic" size={24} color="gray" />
          </View>
  
          <Pressable onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  export default RequestChatRoom;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
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
    iconContainer: {
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
  