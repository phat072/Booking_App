import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useCallback } from "react";
import StackNavigator from "../navigation/StackNavigator";
import { useFonts } from "expo-font";
import { UserProvider } from "../userContext";
import { SplashScreen } from "expo-router";
import { API_URL } from "@env";
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import Colors from "@/constants/Colors";
import { SocketContextProvider } from "@/SocketContext";

// Log loading of .env and API_URL
console.log("env: load .env");
console.log("env: export API_URL =", API_URL);


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
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'blue',
      primaryContainer:'red',
      secondary: 'yellow',
      placeholder: 'yellow',
      outlineVariant:Colors.primary
    },
  };


  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProvider>
          <SocketContextProvider>
            <PaperProvider theme={theme}>
              <StackNavigator />
            </PaperProvider>
          </SocketContextProvider>
        </UserProvider>
      </GestureHandlerRootView>
    </>
  );
}

