import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
  } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/login/LoginScreen";


const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* Uncomment this if you want to use OnboardingScreen */}
                {/* <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                    options={{ headerShown: false }}
                /> */}
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
const styles = StyleSheet.create({});