import React from "react";
import Orders from "../screens/admin/Orders";
import DetailOrders from "../screens/admin/DetailOrders";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OrdersStackParamList } from "@/screens//type";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator<OrdersStackParamList>();

const OrdersStackNavigator: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<OrdersStackParamList>>();

  return (
    <Stack.Navigator>
    <Stack.Screen
      name="Orders"
      component={Orders}
      options={{
        headerTitleAlign: "center",
        headerTitle: "List Orders",
        headerTintColor: "#fff",
        headerStyle: { backgroundColor: "#8dcae0" },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Dashboard");
            }}
          >
            <View
              style={{
                marginLeft: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" size={35} color="#34DBA1" />
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                Back
              </Text>
            </View>
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen
      name="DetailOrders"
      component={DetailOrders}
      options={{
        headerStyle: { backgroundColor: "#1C212D" },
        headerTitleAlign: "center",
        headerTitle: "Details Orders",
        headerTintColor: "#fff",
      }}
    />
  </Stack.Navigator>
);
};

export default OrdersStackNavigator;