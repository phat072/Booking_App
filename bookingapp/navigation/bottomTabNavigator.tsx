import React from "react";
import { View, TextInput, TouchableOpacity, TextInputProps, ViewStyle, TextStyle } from "react-native";
import HomeScreen from "../screens/home/HomeScreen";
// import SearchScreen from "../screens/SearchScreen";
// import AccountScreen from "../screens/Account";
// import MapCenter from "../screens/MapCenter";
// import ResultScreen from "../screens/ResultScreen";
// import RestaurantDetail from "../screens/RestaurantDetail";
// import ChatScreen from "../screens/ChatScreen";
// import FeatureScreen from "../screens/FeatureScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Entypo, AntDesign, Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Icon from "react-native-feather";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    {/* <Stack.Screen
      name="Result"
      component={ResultScreen}
      options={{
        title: "",
        headerStyle: { backgroundColor: "red" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold" } as TextStyle,
      }}
    />
    <Stack.Screen
      name="RestaurantDetail"
      component={RestaurantDetail}
      options={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold" } as TextStyle,
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
        headerTitleStyle: { fontWeight: "bold" } as TextStyle,
        headerTransparent: true,
      }}
    /> */}
  </Stack.Navigator>
);

// const AccountStack: React.FC = () => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="AccountScreen"
//       component={AccountScreen}
//       options={{
//         title: "Tài khoản",
//         headerStyle: { backgroundColor: "red" },
//         headerTintColor: "#fff",
//         headerTitleAlign: "center",
//         tabBarLabelStyle: { color: "#008E97" } as TextStyle,
//         headerShown: true,
//         tabBarIcon: ({ focused }: { focused: boolean }) =>
//           focused ? (
//             <MaterialCommunityIcons name="account" size={24} color="#D71537" />
//           ) : (
//             <MaterialCommunityIcons name="account" size={24} color="#7E7E80" />
//           ),
//       }}
//     />
//     <Stack.Screen
//       name="Chat"
//       component={ChatScreen}
//       options={{
//         headerShown: true,
//         title: "Trò chuyện",
//         headerStyle: { backgroundColor: "red" },
//         headerTintColor: "#fff",
//         headerTitleAlign: "center",
//         headerTitleStyle: { fontWeight: "bold" } as TextStyle,
//       }}
//     />
//   </Stack.Navigator>
// );

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
      {/* <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={({ navigation }) => ({
          headerStyle: { backgroundColor: "red" },
          tabBarLabelStyle: { color: "#008E97" } as TextStyle,
          title: "Search",
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <FontAwesome name="search" size={24} color="#D71537" />
            ) : (
              <FontAwesome name="search" size={24} color="#7E7E80" />
            ),
          headerTitleAlign: "center",
          headerTitle: () => (
            <View>
              <View
                style={{
                  borderRadius: 100,
                  color: "#008E97",
                  alignItems: "center",
                  justifyContent: "space-around",
                  padding: 10,
                  flexDirection: "row",
                } as ViewStyle}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
                <Icon.Search
                  style={{
                    position: "absolute",
                    left: 60,
                    zIndex: 2,
                  }}
                  height="20"
                  width="20"
                  stroke="gray"
                />
                <TextInput
                  placeholder="Tìm kiếm"
                  style={{
                    zIndex: 1,
                    position: "relative",
                    borderRadius: 100,
                    backgroundColor: "white",
                    width: 320,
                    height: 35,
                    paddingLeft: 40,
                    marginLeft: 30,
                  } as TextInputProps["style"]}
                  keyboardType="default"
                />
              </View>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="MapCenter"
        component={MapCenter}
        options={{
          tabBarLabel: "MapCenter",
          tabBarLabelStyle: { color: "#008E97" } as TextStyle,
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <Entypo name="map" size={24} color="#D71537" />
            ) : (
              <Entypo name="map" size={24} color="#7E7E80" />
            ),
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountStack}
        options={{
          title: "Account",
          headerStyle: { backgroundColor: "red" },
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
      /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
