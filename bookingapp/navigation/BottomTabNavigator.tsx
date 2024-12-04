import React from 'react';
import { Text, TextStyle } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Entypo, AntDesign, Ionicons, FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

// Screens import
import HomeScreen from "../screens/home/HomeScreen";
import SearchScreen from "../screens/search/SearchScreen";
import AccountScreen from "../screens/account/Account";
import ResultScreen from "../screens/result/ResultScreen";
import RestaurantDetail from "../screens/restaurant/RestaurantDetail";
import MapScreen from '../screens/map/MapScreen';
import FeatureScreen from "../screens/feature/FeatureScreen";
import ChatScreen from "../screens/account/message/ChatScreen";
import ProfileScreen from '@/screens/account/message/ProfileScreen';
import RequestChatRoom from '@/screens/account/message/RequestChatRoom';
import ChatRoom from '@/screens/account/message/ChatRoom';
import PeopleScreen from '@/screens/account/message/PeopleScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Chats"
        component={ChatScreen}
        options={{
          tabBarStyle: { backgroundColor: 'white'},
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="chat-bubble-outline"
              size={30}
              color={focused ? '#ff4757' : '#989898'}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#ff4757' : '#989898' }}>Profile</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarStyle: { backgroundColor: 'white' },
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={30}
              color={focused ? '#ff4757' : '#989898'}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#ff4757' : '#989898' }}>Profile</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function Chats() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="People"
        component={PeopleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Request" component={RequestChatRoom} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  );
}

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
        headerTitleStyle: { fontWeight: "bold" },
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

const AccountStack: React.FC = () => {
  return (
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
    </Stack.Navigator>
  );
};

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
        component={MapScreen}
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
        options={{
          tabBarLabelStyle: { color: "#008E97" } as TextStyle,
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <FontAwesome name="search" size={24} color="#D71537" />
            ) : (
              <FontAwesome name="search" size={24} color="#7E7E80" />
            ),
        }}
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
