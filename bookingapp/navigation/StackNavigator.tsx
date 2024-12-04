import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RegisterScreen from "../screens/register/RegisterScreen";
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
import AdminTabNavigator from "../navigation/AdminTabNavigator";
import FavouriteScreen from "../screens/favourite/FavouriteScreen";
import { useNavigation } from '@react-navigation/native';
import { Ionicons} from "@expo/vector-icons";
const Stack = createNativeStackNavigator<StackStackParamList>();
import Colors from "@/constants/Colors";
import { Chats } from "./BottomTabNavigator";

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
            title: "Lịch sử giao dịch", // Tiêu đề màn hình
            headerStyle: { backgroundColor: Colors.primary }, // Màu nền header
            headerTintColor: "#fff", // Màu chữ
            headerTitleAlign: "center", // Căn giữa tiêu đề
            headerTitleStyle: {
              fontWeight: "bold", // Đặt font chữ đậm
            },
            headerShown: true, // Hiển thị header
            header: () => <CustomHeader />, // Sử dụng CustomHeader để tạo header tùy chỉnh
          }}
        />
        <Stack.Screen
          name="Favourite"
          component={FavouriteScreen}
          options={{
            title: "Yêu thích",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="BottomSheet"
          component={BottomSheetTest}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="City"
          component={CityScreen}
          options={{
            title: "Chọn tỉnh/thành",
            headerStyle: { backgroundColor: Colors.primary },
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
            headerStyle: { backgroundColor: Colors.primary },
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
            headerStyle: { backgroundColor: Colors.primary },
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
            headerStyle: { backgroundColor: Colors.primary },
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
            headerStyle: { backgroundColor: Colors.primary },
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
            headerStyle: { backgroundColor: Colors.primary },
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
          name="Chats"
          component={Chats}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Filter"
          component={FilterScreen}
          options={{
            title: "Lọc",
            headerStyle: { backgroundColor: Colors.primary },
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
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShown: true,
            header: () => <CustomHeader />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const CustomHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.customHeader}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" color={'#fff'} size={30}/>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Thông tin người dùng</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    backgroundColor: Colors.primary, // Màu nền đỏ cho container title
    paddingVertical: 20,    // Điều chỉnh padding cho chiều dọc
    alignItems: "center",   // Căn giữa theo chiều ngang
    justifyContent: "center", // Căn giữa theo chiều dọc
    width: "100%",          // Chiều rộng đầy đủ
    marginBottom: 0,        // Loại bỏ khoảng cách dưới tiêu đề
    flexDirection: "row",   // Sắp xếp ngang
    paddingHorizontal: 10,  // Điều chỉnh khoảng cách ngang   
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff", // Màu chữ trắng
    flex: 1,        // Căn giữa tiêu đề
    textAlign: "center",
  },
});
