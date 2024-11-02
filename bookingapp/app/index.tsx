import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import StackNavigator from "../navigation/stackNavigator";
import { useFonts } from "expo-font";
import { UserProvider } from "../userContext";
import { SplashScreen } from "expo-router";


export default function App() {
  const [fontsLoaded] = useFonts({
    regular: require("../assets/fonts/Poppins-Regular.ttf"),
    light: require("../assets/fonts/Poppins-Light.ttf"),
    bold: require("../assets/fonts/Poppins-Bold.ttf"),
    medium: require("../assets/fonts/Poppins-Medium.ttf"),
    extrabold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    semibold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();

    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return;
  }
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProvider>
          <StackNavigator />
        </UserProvider>
      </GestureHandlerRootView>
    </>
  );
}

