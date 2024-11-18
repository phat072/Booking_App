import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const HeaderComponent = ({ navigation, headerAnimatedStyle }: any) => {
  return (
    <Animated.View style={[headerAnimatedStyle, styles.header]}>
      <View style={styles.bar}>
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HeaderComponent;
