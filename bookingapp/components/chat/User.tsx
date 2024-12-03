import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChatNavigationProp } from "../type";
interface UserProps {
  item: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
}

const User: React.FC<UserProps> = ({ item }) => {
  const navigation = useNavigation<ChatNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.userRow}>
        <Pressable>
          <Image
            source={{ uri: item?.image }}
            style={styles.profileImage}
          />
        </Pressable>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item?.name}</Text>
          <Text style={styles.userEmail}>{item?.email}</Text>
        </View>

        <Pressable
          onPress={() =>
            navigation.navigate('Request', {
              name: item?.name,
              receiverId: item?._id,
            })
          }
          style={styles.chatButton}
        >
          <Text style={styles.chatButtonText}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '500',
  },
  userEmail: {
    color: 'gray',
  },
  chatButton: {
    padding: 10,
    width: 80,
    backgroundColor: '#005187',
    borderRadius: 4,
  },
  chatButtonText: {
    textAlign: 'center',
    color: 'white',
  },
});
