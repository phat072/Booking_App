import { StyleSheet, Image, ImageStyle } from 'react-native';
import React from 'react';

interface NetworkImageProps {
  source: { uri: string } | string; // Có thể là chuỗi URL hoặc đối tượng có thuộc tính uri
  width: number; 
  height: number; 
  radius: number; 
  border?: number; 
}

// Hàm để tạo kiểu hình ảnh
const getImageStyle = (width: number, height: number, radius: number, border: number): ImageStyle => ({
  width: width,
  height: height,
  borderRadius: radius,
  resizeMode: "cover",
  borderBottomLeftRadius: border,
  borderBottomRightRadius: border,
  position: "relative",
});

const NetworkImage: React.FC<NetworkImageProps> = ({ source, width, height, radius, border = 0 }) => {
  // Gọi hàm để lấy kiểu hình ảnh
  const imageStyle = getImageStyle(width, height, radius, border);

  return (
    <Image
      source={typeof source === 'string' ? { uri: source } : source} // Kiểm tra kiểu của source
      style={imageStyle} // Sử dụng kiểu đã tạo
    />
  );
};

export default NetworkImage;

const styles = StyleSheet.create({});
