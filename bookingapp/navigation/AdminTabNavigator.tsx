import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import HomeAdmin from "../screens/admin/HomeAdmin";
import Customers from "../screens/admin/Customers";
import OrdersStackNavigator from "./OrdersStackNavigator";
import ResAdminStackNavigator from "./ResAdminStackNavigator";
import Category from "../screens/admin/Category";

const SCREEN_WIDTH = Dimensions.get("window").width;

const AdminTabNavigator: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<string>("Dashboard");

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged out", "You have been logged out successfully.");
      setActiveScreen("Login"); // Replace navigation logic here if needed.
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Logout Error", "An error occurred while logging out.");
    }
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case "Dashboard":
        return <HomeAdmin />;
      case "Customers":
        return <Customers />;
      case "Restaurants":
        return <ResAdminStackNavigator />;
      case "OrderTab":
        return <OrdersStackNavigator />;
      case "Category":
        return <Category />;
      default:
        return <HomeAdmin />;
    }
  };

  const drawerItems = [
    {
      label: "Dashboard",
      icon: <MaterialIcons name="dashboard" size={24} color="black" />,
      action: () => setActiveScreen("Dashboard"),
    },
    {
      label: "Customers",
      icon: <MaterialCommunityIcons name="account" size={24} color="black" />,
      action: () => setActiveScreen("Customers"),
    },
    {
      label: "Restaurants",
      icon: <Ionicons name="restaurant" size={24} color="black" />,
      action: () => setActiveScreen("Restaurants"),
    },
    {
      label: "OrderTab",
      icon: (
        <MaterialCommunityIcons
          name="order-bool-descending-variant"
          size={24}
          color="black"
        />
      ),
      action: () => setActiveScreen("OrderTab"),
    },
    {
      label: "Category",
      icon: <MaterialIcons name="category" size={24} color="black" />,
      action: () => setActiveScreen("Category"),
    },
    {
      label: "Logout",
      icon: <AntDesign name="logout" size={24} color="black" />,
      action: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Drawer Menu */}
      <View style={styles.drawerContainer}>
        <FlatList
          data={drawerItems}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.drawerItem,
                activeScreen === item.label && styles.activeDrawerItem,
              ]}
              onPress={item.action}
            >
              {item.icon}
              <Text style={styles.drawerLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Active Screen */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>
    </View>
  );
};

export default AdminTabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  drawerContainer: {
    width: SCREEN_WIDTH * 0.3, // Drawer width is 30% of the screen
    backgroundColor: "#f8f8f8",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    paddingVertical: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
  },
  activeDrawerItem: {
    backgroundColor: "#e6e6e6",
  },
  drawerLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "black",
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
