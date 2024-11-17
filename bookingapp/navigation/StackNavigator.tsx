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

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    // const Tab = createBottomTabNavigator();

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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
const styles = StyleSheet.create({});