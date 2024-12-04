import React from "react";
import { View, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import HomeAdmin from "../screens/admin/HomeAdmin";
import Customers from "../screens/admin/Customers";
import OrdersStackNavigator from "./OrdersStackNavigator";
import ResAdminStackNavigator from "./resAdminStackNavigator";
import Category from "../screens/admin/Category";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "expo-router";
import { AccountStackParamList } from "@/screens/type";
import { StackNavigationProp } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

const AdminTabNavigator: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AccountStackParamList>>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged out", "You have been logged out successfully.");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Logout Error", "An error occurred while logging out.");
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,  // Hide labels in tab bar
        tabBarStyle: styles.tabContainer,
      }}
      tabBar={(props) => (
        <View style={styles.customTabBar}>
          <View style={styles.tabBarItems}>
            {props.state.routes.map((route, index) => {
              const { options } = props.descriptors[route.key];
              const icon = options.tabBarIcon
                ? options.tabBarIcon({
                  color: "black", size: 24,
                  focused: false
                })
                : null;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.tabItem}
                  onPress={() => props.navigation.navigate(route.name)}
                >
                  {icon}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <AntDesign name="logout" size={24} color="black" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeAdmin}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Customers"
        component={Customers}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Restaurants"
        component={ResAdminStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OrderTab"
        component={OrdersStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="order-bool-descending-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Category"
        component={Category}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
  },
  customTabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabBarItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  tabItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "black",
  },
});
