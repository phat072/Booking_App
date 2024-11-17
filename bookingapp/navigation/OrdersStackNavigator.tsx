import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Orders from "../screens/admin/Orders";
import DetailOrders from "../screens/admin/DetailOrders";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "@/screens//type";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator<AdminStackParamList>();

const OrdersStackNavigator: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          headerTitleAlign: "center",
          headerTitle: "List Orders",
          headerTintColor: "#fff",
          headerStyle: styles.headerStyle,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
              <View style={styles.headerLeftContainer}>
                <Ionicons name="chevron-back" size={35} color="#34DBA1" />
                <Text style={styles.headerLeftText}>Dashboard</Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="DetailOrders"
        component={DetailOrders}
        options={{
          headerStyle: styles.headerStyle,
          headerTitleAlign: "center",
          headerTitle: "Details Orders",
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#1C212D",
  },
  headerLeftContainer: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  headerLeftText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default OrdersStackNavigator;
