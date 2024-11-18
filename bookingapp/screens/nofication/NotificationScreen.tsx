import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ViewStyle, TextStyle } from "react-native";
import LottieView from "lottie-react-native";

const NotificationScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <LottieView
          style={styles.lottie}
          source={require("@/assets/lottie/empty.json")}
          autoPlay
          loop
        />
        <Text style={styles.message}>Rất tiếc! Không có dữ liệu</Text>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    position: "relative",
  } as ViewStyle,
  center: {
    flex: 1,
    alignItems: "center",
  } as ViewStyle,
  lottie: {
    width: 200,
    height: 200,
    marginTop: 100,
  } as ViewStyle,
  message: {
    fontSize: 20,
    color: "#BABABA",
    fontWeight: "bold",
    marginTop: 170,
  } as TextStyle,
});
