import { View, Text, ScrollView, Alert, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Avatar, Button, Overlay } from "@rneui/themed";
import axios from "axios";
import { API_URL } from "@env";
import { TextInput } from "react-native-paper";
import { CheckBox } from "@rneui/themed";
import { LinearGradient } from 'expo-linear-gradient';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  admin: boolean;
}

const Customers = () => {
  const [users, setUsers] = useState<User[]>([]); // Typed users as an array of User
  const [loading, setLoading] = useState(true);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // String or null type for selectedUserId
  const [editData, setEditData] = useState<{ name: string; email: string }>({ name: "", email: "" });
  const [selectedIndex, setIndex] = useState<number>(0); // Explicitly typing selectedIndex as number

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin`);
      if (!response.data) {
        throw new Error("Failed to fetch users");
      }
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Failed to fetch users");
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => { // Typing userId as string
    setSelectedUserId(userId);
    setIsDeleteVisible(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await axios.delete(`${API_URL}/admin/${selectedUserId}`);
      if (response.status === 200) {
        fetchUsers();
        Alert.alert("Success", "User deleted successfully");
      } else {
        Alert.alert("Error", "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert("Error", "Failed to delete user");
    } finally {
      setIsDeleteVisible(false);
      setSelectedUserId(null);
    }
  };

  const cancelDeleteUser = () => {
    setIsDeleteVisible(false);
    setSelectedUserId(null);
  };

  const handleEditUser = (user: User) => { // Typing user as User
    setSelectedUserId(user._id);
    setEditData({ name: user.name, email: user.email });
    setIsEditVisible(true);
  };

  const confirmEditUser = async () => {
    try {
      const updatedData = {
        ...editData,
        admin: selectedIndex === 1,  // If selectedIndex is 1, set admin to true
        role: selectedIndex === 1 ? "admin" : "user",  // If selectedIndex is 1, set role to "admin", else "user"
      };
      
      const response = await axios.put(
        `${API_URL}/admin/${selectedUserId}`,
        updatedData
      );
      if (response.status === 200) {
        fetchUsers();
        Alert.alert("Success", "User updated successfully");
      } else {
        Alert.alert("Error", "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user");
    } finally {
      setIsEditVisible(false);
      setSelectedUserId(null);
    }
  };

  const cancelEditUser = () => {
    setIsEditVisible(false);
    setSelectedUserId(null);
  };

  const AVATAR_DEFAULT =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {users.map((user) => (
          <View key={user._id} style={styles.userContainer}>
            <View style={styles.userDetails}>
              <Avatar
                size={60}
                rounded
                source={{ uri: user?.avatar || AVATAR_DEFAULT }}
              />
              <View style={styles.userInfo}>
                <View
                  style={{
                    borderRadius: 5,
                    width: 60,
                    height: 25,
                    backgroundColor: user.admin ? "#FADCDE" : "#CCEEDD",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: user.admin ? "#E7515A" : "#00AB55",
                    }}
                  >
                    {user.admin ? "admin" : "user"}
                  </Text>
                </View>
                <Text style={styles.userName}>{user.name}</Text>
              </View>
            </View>
            <View style={styles.userActions}>
              <Button
                buttonStyle={styles.editButton}
                onPress={() => handleEditUser(user)}
                radius={"md"}
                size="lg"
                color="#20C0ED"
              >
                Edit
              </Button>
              <Button
                buttonStyle={styles.deleteButton}
                onPress={() => handleDeleteUser(user._id)}
                radius={"md"}
                size="lg"
                color="#DB4C3F"
              >
                Delete
              </Button>
            </View>
          </View>
        ))}
      </View>

      {/* Delete Overlay */}
      <Overlay
        isVisible={isDeleteVisible}
        onBackdropPress={cancelDeleteUser}
        overlayStyle={styles.overlay}
      >
        <Text style={styles.overlayTitle}>Confirm Delete</Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          Are you sure you want to delete this user?
        </Text>
        <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "center" }}>
          <Button
            buttonStyle={styles.cancelButton}
            onPress={cancelDeleteUser}
            radius={"lg"}
            size="lg"
            color="#999"
          >
            Cancel
          </Button>
          <Button
            buttonStyle={styles.confirmButton}
            onPress={confirmDeleteUser}
            radius={"lg"}
            size="lg"
            color="#DB4C3F"
          >
            OK
          </Button>
        </View>
      </Overlay>

      {/* Edit Overlay */}
      <Overlay
        isVisible={isEditVisible}
        onBackdropPress={cancelEditUser}
        overlayStyle={styles.editOverlay}
      >
        <Button
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#36C2CE", "#478CCF", "#77E4C8", "#4535C1"],
            start: { x: 0, y: 0.5 },
            end: { x: 1, y: 0.5 },
          }}
          buttonStyle={{
            borderRadius: 5,
          }}
        >
          Edit User
        </Button>

        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Name"
          left={<TextInput.Icon icon="rename-box" color="#18181B" size={30} />}
          value={editData.name}
          outlineColor="#E4E4E7"
          activeOutlineColor="black"
          onChangeText={(text) => setEditData({ ...editData, name: text })}
        />

        <TextInput
          style={{ marginTop: 15 }}
          mode="outlined"
          label="Email"
          value={editData.email}
          outlineColor="#E4E4E7"
          activeOutlineColor="black"
          left={<TextInput.Icon icon="email-edit" color="#18181B" size={30} />}
          onChangeText={(text) => setEditData({ ...editData, email: text })}
        />
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 5, borderRadius: 10, borderColor: "#E4E4E7" }}>
            <Text style={{ fontSize: 16 }}>Admin</Text>
            <CheckBox
              checked={selectedIndex === 0}
              onPress={() => setIndex(0)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 5, borderRadius: 10, borderColor: "#E4E4E7", marginLeft: 10 }}>
            <Text style={{ fontSize: 16 }}>User</Text>
            <CheckBox
              checked={selectedIndex === 1}
              onPress={() => setIndex(1)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />
          </View>
        </View>
        <View style={styles.overlayActions}>
          <Button
            buttonStyle={styles.cancelButton}
            onPress={cancelEditUser}
            radius={"lg"}
            size="lg"
            color="#999"
          >
            Cancel
          </Button>
          <Button
            buttonStyle={styles.confirmButton}
            onPress={confirmEditUser}
            radius={"lg"}
            size="lg"
            color="#20C0ED"
          >
            Save
          </Button>
        </View>
      </Overlay>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    padding: 10,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    width: 150,
  },
  userMobile: {
    color: "#ABABAB",
    marginTop: 2,
  },
  userActions: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
  overlay: {
    borderRadius: 15,
    padding: 20,
    width: 300,
  },
  overlayTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  overlayActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancelButton: {
    width: 100,
    marginRight: 10,
    backgroundColor: "#999",
  },
  confirmButton: {
    width: 100,
  },
  editOverlay: {
    borderRadius: 15,
    padding: 20,
    width: 300,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    paddingBottom: 5,
  },
});

export default Customers;