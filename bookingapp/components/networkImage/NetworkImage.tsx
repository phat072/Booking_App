import React from "react";
import { Image, ImageStyle } from "react-native";

interface NetworkImageProps {
  source: string;
  width: number;
  height: number;
  radius: number;
  border?: number;
}

const NetworkImage: React.FC<NetworkImageProps> = ({
  source,
  width,
  height,
  radius,
  border,
}) => {
  // Inline style for dynamic properties
  const imageStyle: ImageStyle = {
    width: width,
    height: height,
    borderRadius: radius,
    resizeMode: "cover",
    borderBottomLeftRadius: border || radius,
    borderBottomRightRadius: border || radius,
    position: "relative",
  };

  return <Image source={{ uri: source }} style={imageStyle} />;
};

export default NetworkImage;
