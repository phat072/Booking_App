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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
const styles = StyleSheet.create({});