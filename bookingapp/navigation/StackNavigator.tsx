import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
  } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RegisterScreen from "../screens/register/RegisterScreen";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/login/LoginScreen";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import Privacy from "../screens/privacy/Privacy";
import HistoryOrder from "../screens/ordrefood/HistoryOrder";
import EditAccount from "../screens/account/EditAccount";
import CityScreen from "../screens/city/CityScreen";
import { StackStackParamList } from "../screens/type";
import BottomSheetTest from "../screens/sheet/BottomSheetTest";
import FilterScreen from "../screens/filter/FilterScreen";
import Success from "../screens/ordrefood/Success";
import BookingHours from "../screens/booking/BookingHours";
import ChangePassword from "../screens/account/ChangePassword";
import NotificationScreen from "../screens/nofication/NotificationScreen";
import FoodDetail from "../screens/ordrefood/FoodDetail";
import ListMenuRes from "../screens/menu/ListMenuRes";
import OrderScreen from "../screens/restaurant/OrderScreen";
import AdminTabNavigator from "../navigation/AdminTabNavigator"
const Stack = createNativeStackNavigator<StackStackParamList>();

const StackNavigator: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Privacy"
          component={Privacy}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HistoryOrder"
          component={HistoryOrder}
          options={{
            title: "Lịch sử giao dịch",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="BottomSheet"
          component={BottomSheetTest}
          options={{
            title: "",
            // headerTitleAlign: "center",
            // headerStyle: { backgroundColor: "red" },
            // headerTintColor: "#fff",
            // headerTitleStyle: {
            //   fontWeight: "bold",
            // },
          }}
        />
        <Stack.Screen
          name="City"
          component={CityScreen}
          options={{
            title: "Chọn tỉnh/thành",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            title: "Ưu đãi",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            title: "Change password",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="BookingHours"
          component={BookingHours}
          options={{
            title: "Thông tin giao dịch",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FoodDetail"
          component={FoodDetail}
          options={{
            title: "food details",
            headerStyle: { backgroundColor: "transparent" },
            headerTintColor: "#000000",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="OrderSuccess"
          component={Success}
          options={{
            title: "order tình trạng",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{
            title: "Thông tin giao dịch",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="ListMenuRes"
          component={ListMenuRes}
          options={{
            title: "Danh mục các sản phẩm",
            headerStyle: { backgroundColor: "#FFFFFF" },
            headerTintColor: "#000000",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Filter"
          component={FilterScreen}
          options={{
            title: "Lọc",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditAccount"
          component={EditAccount}
          options={{
            title: "Thông tin người dùng",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
const styles = StyleSheet.create({});