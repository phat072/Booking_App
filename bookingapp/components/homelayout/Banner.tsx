import React from "react";
import Swiper from 'react-native-swiper';
import { Image, StyleSheet, View } from "react-native";

interface BannerProps {
  images: string[];
}

const Banner: React.FC<BannerProps> = ({ images }) => {
  return (
    <Swiper style={styles.wrapper} showsButtons={false} autoplay={true} autoplayTimeout={3}>
      {images.map((imageUrl, index) => (
        <View key={index} style={styles.slide}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 35,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
  },
});

export default Banner;