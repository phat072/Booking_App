import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/login/LoginScreen";
// import OnboardingScreen from "../screens/onboarding/OnboardingScreen";


const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    
    return (
        <NavigationContainer>
        <Stack.Navigator>
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