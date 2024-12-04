import { StyleSheet, Text, View, SafeAreaView, FlatList, Pressable, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserType } from '@/userContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ChatNavigationProp } from '@/screens/type';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

const PeopleScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useContext(UserType);
  const userId = user?._id;
  const navigation = useNavigation<ChatNavigationProp>();
  const [loading, setLoading] = useState(true);

  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${userId}`);
      const data = await response.json();
      // console.log('Fetched users:', data);
      setUsers(data.users || [data]);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerText}>People using Signal</Text>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={26} color="black" />
      </Pressable>
    </View>

    {loading ? (
      <Text>Loading...</Text> // or use a spinner
    ) : users.length === 0 ? (
      <Text style={styles.noUsersText}>No users found</Text>
    ) : (
      <FlatList
        data={users}
        renderItem={({ item }) => {
          console.log('Rendering item:', item);
          return (
            <View style={styles.userContainer}>
              <Image source={{ uri: item.image }} style={styles.userImage} />
              <Text>{item.name}</Text>
              <Text>{item.email}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item._id}
      />
    )}
  </SafeAreaView>
  );
};

export default PeopleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  backButton: {
    marginRight: 'auto',
  },
  noUsersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  userContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
