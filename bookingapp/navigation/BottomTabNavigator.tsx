import React from "react";
import { View, TextInput, TouchableOpacity, TextInputProps, ViewStyle, TextStyle } from "react-native";
import HomeScreen from "../screens/home/HomeScreen";
import SearchScreen from "../screens/search/SearchScreen";
import AccountScreen from "../screens/account/Account";
import ResultScreen from "../screens/result/ResultScreen";
import RestaurantDetail from "../screens/restaurant/RestaurantDetail";
import MapScreen from '../screens/map/MapScreen'
import FeatureScreen from "../screens/feature/FeatureScreen";
// import ChatScreen from "../screens/account/ChatScreen";
import ChatScreen from "../screens/account/message/Chat";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Entypo, AntDesign, Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Result"
      component={ResultScreen}
      options={{
        title: "",
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />
    <Stack.Screen
      name="RestaurantDetail"
      component={RestaurantDetail}
      options={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold"},
        headerTransparent: true,
      }}
    />
    <Stack.Screen
      name="FeatureScreen"
      component={FeatureScreen}
      options={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold" },
        headerTransparent: true,
      }}
    /> 
  </Stack.Navigator>
);

const AccountStack: React.FC = () => (
  <Stack.Navigator>
   <Stack.Screen
       name="AccountScreen"
      component={AccountScreen}
       options={{
        title: "Tài khoản",
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
     <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{
        headerShown: true,
        title: "Trò chuyện",
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />

   </Stack.Navigator>
 );

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#008E97" } as TextStyle,
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <Entypo name="home" size={24} color="#D71537" />
            ) : (
              <AntDesign name="home" size={24} color="#7E7E80" />
            ),
        }}
      />
            <Tab.Screen
        name="MapScreen"
        component={MapScreen} // Thêm màn hình MapScreen
        options={{
          tabBarLabel: "Map",
          tabBarLabelStyle: { color: "#008E97" } as TextStyle,
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="map" size={24} color="#D71537" />
            ) : (
              <Entypo name="map" size={24} color="#7E7E80" />
            ),
        }}
      />
       <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={({ navigation }) => ({
          tabBarLabelStyle: { color: "#008E97" } as TextStyle,
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <FontAwesome name="search" size={24} color="#D71537" />
            ) : (
              <FontAwesome name="search" size={24} color="#7E7E80" />
            ),
 
        })}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountStack}
        options={{
          title: "Account",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          tabBarLabelStyle: { color: "#008E97" } as TextStyle,
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <MaterialCommunityIcons name="account" size={24} color="#D71537" />
            ) : (
              <MaterialCommunityIcons name="account" size={24} color="#7E7E80" />
            ),
        }}
      /> 
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
