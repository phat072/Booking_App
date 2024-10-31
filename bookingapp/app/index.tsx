import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import StackNavigator from "../navigation/stackNavigator";
import { useFonts } from "expo-font";
import { UserProvider } from "../userContext";
import { MD3LightTheme as DefaultTheme, PaperProvider, MD3Theme } from "react-native-paper";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App(): JSX.Element | null {
  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Poppins-Regular.ttf"),
    light: require("./assets/fonts/Poppins-Light.ttf"),
    bold: require("./assets/fonts/Poppins-Bold.ttf"),
    medium: require("./assets/fonts/Poppins-Medium.ttf"),
    extrabold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
    semibold: require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const theme: MD3Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'blue',
      primaryContainer: 'red',
      secondary: 'yellow',
      outlineVariant: "red",
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <UserProvider>
        <PaperProvider theme={theme}>
          <StackNavigator />
        </PaperProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
