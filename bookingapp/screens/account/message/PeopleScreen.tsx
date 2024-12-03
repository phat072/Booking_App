import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserType } from '@/userContext';
import User from '@/components/chat/User';
import { API_URL } from '@env';

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

const PeopleScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { userId } = useContext( UserType );

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>People using Signal</Text>
      </View>

      <FlatList
        data={users}
        renderItem={({ item }) => <User item={item} key={item?._id} />}
        keyExtractor={(item) => item._id}
      />
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
    marginVertical: 12,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
