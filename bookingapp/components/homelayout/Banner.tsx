import React from "react";
import Swiper from "react-native-swiper";
import { Image, StyleSheet, View } from "react-native";

interface BannerProps {
  images: string[];
}

const Banner: React.FC<BannerProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return null; // Không hiển thị nếu không có ảnh
  }

  return (
    <Swiper
      style={styles.wrapper}
      showsButtons={false}
      autoplay={true}
      autoplayTimeout={3}
      loop={true}
    >
      {images.map((imageUrl, index) => (
        <View key={index} style={styles.slide}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover" // Giúp ảnh giữ tỷ lệ
            onError={() => console.warn(`Failed to load image: ${imageUrl}`)}
          />
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 150, // Đảm bảo swiper có chiều cao
    marginTop: 20,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 150,
  },
});

export default Banner;
