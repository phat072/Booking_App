import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign, Entypo, Feather, Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import Colors from "../../constants/Colors";
// import { defaultStyles } from "../../constants/Styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
const { width } = Dimensions.get("window");
const IMG_HEIGHT = 200;

interface FeatureScreenParams {
  title: string;
  subTitle: string;
  restaurants: Array<{
    id?: string;
    name: string;
    address: string;
    rating: number;
    image?: string;
    promotions: string;
  }>;
  layout?: any;
}

const FeatureScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, subTitle, restaurants } = route.params as FeatureScreenParams;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  
  useLayoutEffect(() => {
    navigation.setOptions({
    //   headerTitle: "",
      headerBackVisible: false,
      headerTransparent: true,
      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]} />
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={22} color={"#ffffff"} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={"#ffffff"} />
          </TouchableOpacity> */}
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={"#ffffff"} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <Animated.Text
          style={[headerTitleAnimatedStyle, styles.headerTitle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Animated.Text>
      ),
    });
  }, [navigation, title]);

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);

  const headerTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [IMG_HEIGHT / 2, IMG_HEIGHT], [0, 1]),
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [IMG_HEIGHT / 2, IMG_HEIGHT],
            [20, 0]
          ),
        },
      ],
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{
            uri: "https://pasgo.vn/Upload/anh-chi-tiet/slide-isushi-1-normal-2281058760960.webp",
          }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{title}</Text>
          <Text style={styles.desc}>{subTitle}</Text>
          <View style={styles.subInfo}>
            <Text style={styles.rooms}>Bởi : Thanhdao</Text>
            <Text>Cập nhật : 28/12/2023</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.followButton}>Theo dõi bộ sưu tập</Text>
          </TouchableOpacity>
          <View style={styles.subInfo}>
            <Text style={styles.rooms}>0 người theo dõi</Text>
            <Text>114 điểm đến</Text>
          </View>
          <Text style={styles.sortButton}>Sắp xếp gần nhất</Text>
          <ScrollView>
                {restaurants.map((item, index) => (
                    <RestaurantCard key={item.id || index} item={{ ...item, image: item.image || '' }} layout={2} />
                ))}
          </ScrollView>

        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  image: { height: IMG_HEIGHT, width },
  infoContainer: { padding: 15, backgroundColor: "#fff" },
  name: { fontSize: 18, fontWeight: "bold" },
  desc: { fontSize: 17, marginTop: 10, color: "#282828" },
  rooms: { fontSize: 16, color: Colors.grey, marginVertical: 4 },
  subInfo: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  followButton: { backgroundColor: "#F44236", padding: 10, color: "#fff", textAlign: "center", fontWeight: "bold", borderRadius: 8 },
  sortButton: { backgroundColor: "#fff", padding: 10, borderColor: "#CCCCCC", borderWidth: 1, borderRadius: 8, marginTop: 8 },
  roundButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#000", opacity: 0.7, justifyContent: "center", alignItems: "center" },
  bar: { flexDirection: "row", gap: 10, justifyContent: "center" },
  header: { backgroundColor: Colors.primary, height: 100 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});

export default FeatureScreen;
