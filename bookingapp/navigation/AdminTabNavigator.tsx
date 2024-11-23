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
import ResAdminStackNavigator from "./resAdminStackNavigator";
import Category from "../screens/admin/Category";
import { AccountStackParamList } from "@/screens/type";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
const SCREEN_WIDTH = Dimensions.get("window").width;

const AdminTabNavigator: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<string>("Dashboard");
  const navigation = useNavigation<StackNavigationProp<AccountStackParamList>>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged out", "You have been logged out successfully.");
      navigation.replace("Login");
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
      {/* Active Screen */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* Bottom Tab Menu */}
      <View style={styles.tabContainer}>
        <FlatList
          data={drawerItems}
          horizontal
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeScreen === item.label && styles.activeTabItem,
              ]}
              onPress={item.action}
            >
              {item.icon}
              <Text style={styles.tabLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default AdminTabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // Stack items vertically
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Distribute items evenly
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
  },
  tabItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  activeTabItem: {
    backgroundColor: "#e6e6e6", // Highlight active tab
  },
  tabLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "black",
  },
});
