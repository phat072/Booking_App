import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode as base64Decode } from "base-64";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface OnboardingScreenProps {
  navigation: any; 
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);

  useEffect(() => {
    let isUnmounted = false;

    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/music/music.mp3"),
        { shouldPlay: isPlaying, positionMillis: 27000 }
      );

      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.replayAsync();
        }
      });

      if (!isUnmounted) {
        setSound(sound);
      }
    };

    if (isPlaying) {
      loadSound();
    }

    return () => {
      isUnmounted = true;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [isPlaying]);

  const handleButtonPress = async () => {
    setIsPlaying(false);
    if (sound) {
      await sound.unloadAsync();
    }

    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      navigation.navigate("Login");
      return;
    }

    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(base64Decode(payloadBase64));

    if (payload.admin) {
      navigation.navigate("Admin");
    } else {
      navigation.navigate("Main");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lottieContainer}>
        <LottieView
          style={[styles.lottie, styles.leftLottie]}
          source={require("../../assets/lottie/element.json")}
          autoPlay
          loop
        />
        <LottieView
          style={[styles.lottie, styles.rightLottie]}
          source={require("../../assets/lottie/element.json")}
          autoPlay
          loop
        />
      </View>
      <View style={styles.center}>
        <LottieView
          style={{ width: 300, height: 420, marginTop: 70 }}
          source={require("../../assets/lottie/food-onboard.json")}
          autoPlay
          loop
        />
      </View>

      <View style={{ width: 400, height: 200 }}>
        <MaterialCommunityIcons
          style={styles.quoteLeft}
          name="format-quote-open"
          size={24}
          color="#fbc4ab"
        />
        <Text style={styles.logan}>
          Top nhà hàng ngon, ấm cúng & có ưu đãi hấp dẫn gợi ý mùa Giáng Sinh
          2023
        </Text>
        <MaterialCommunityIcons
          style={styles.quoteRight}
          name="format-quote-close"
          size={24}
          color="#fbc4ab"
        />
      </View>
      <TouchableOpacity style={styles.beginButton} onPress={handleButtonPress}>
        <Text style={styles.beginButtonText}>Begin</Text>
        <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  lottieContainer: {
    flexDirection: "row",
  },
  logan: {
    position: "relative",
    padding: 25,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#826251",
    fontStyle: "italic",
    lineHeight: 40,
  },
  leftLottie: {
    top: -30,
    left: -5,
  },
  rightLottie: {
    top: -30,
    right: 0,
  },
  lottie: {
    position: "absolute",
    width: 300,
    height: 300,
  },
  quoteLeft: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  quoteRight: {
    position: "absolute",
    bottom: 120,
    right: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseButton: {
    padding: 20,
    position: "absolute",
    bottom: 300,
    left: -2,
  },
  beginButton: {
    backgroundColor: "#f4978e",
    padding: 20,
    width: "90%",
    borderRadius: 10,
    marginBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  beginButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  iconImage: {
    width: 50,
    height: 50,
  },
});
