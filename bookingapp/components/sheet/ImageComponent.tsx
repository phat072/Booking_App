import React from "react";
import { Image, StyleSheet, Dimensions } from "react-native";
import Animated from "react-native-reanimated";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 250;

const ImageComponent = ({ imageAnimatedStyle }: any) => {
  return (
    <Animated.Image
      source={{
        uri: "https://pasgo.vn/Upload/anh-chi-tiet/slide-isushi-1-normal-2281058760960.webp",
      }}
      style={[styles.image, imageAnimatedStyle]}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
});

export default ImageComponent;
