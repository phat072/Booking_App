import React from "react";
import { View, Text, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Colors from "@/constants/Colors";

const Success: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const navigateToHome = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={styles.container}>
      <LottieView
        style={styles.lottie}
        source={require("@/assets/lottie/orders1.json")}
        autoPlay
        loop
      />
      <Text style={styles.title}>Đặt hành thành công</Text>
      <Text style={styles.description}>
        Cảm ơn quý khách đã tin tưởng BookingRes và trải nghiệm dịch vụ. Nếu có
        mọi thắc mắc gì xin hãy liên hệ với chúng tôi!
      </Text>
      <View style={styles.buttonContainer}>
        <Text style={styles.button} onPress={navigateToHome}>
          Tiếp tục đặt bàn
        </Text>
      </View>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
  } as ViewStyle,
  lottie: {
    width: 200,
    height: 200,
    marginTop: 100,
  } as ViewStyle,
  title: {
    marginTop: 120,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  } as TextStyle,
  description: {
    textAlign: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    fontSize: 16,
  } as TextStyle,
  buttonContainer: {
    marginTop: 50,
    alignItems: "center",
  } as ViewStyle,
  button: {
    backgroundColor: Colors.primary,
    color: "#ffffff",
    fontSize: 17,
    padding: 20,
    borderRadius: 10,
    textAlign: "center",
  } as TextStyle,
});
