import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { StackStackParamList } from "../type";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 250;

type FoodDetailRouteProp = RouteProp<StackStackParamList, "FoodDetail">;

interface FoodDetailProps {
  route: FoodDetailRouteProp;
}

const FoodDetail: React.FC<FoodDetailProps> = ({ route }) => {
  const { item, restaurant } = route.params;
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const translateY = useSharedValue(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,
      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]} />
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
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
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
  }));

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: item.image }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />

<View style={styles.infoContainer}>
          <View className="p-4">
            <View className="">
              <Text className="text-xl font-bold">
                <Text className="text-base text-[#E84C3F]">Độc quyền  </Text>
               {item.title}
              </Text>
              <Text className="text-base">
              {item.subTitle}
              </Text>
              {item.originalPrice !== item.discountedPrice ? (
                    <Text className="font-bold mt-2">
                      <Text className="line-through text-[#ccc] font-normal">
                        {item.originalPrice}đ
                      </Text>
                      /{item.discountedPrice}đ
                      <Text className="text-[#E84C3F]">
                        -{item.discountPercentage}%
                      </Text>
                    </Text>
                  ) : (
                    <Text className="font-bold mt-2">{item.originalPrice}đ</Text>
                  )}
              <Text className="text-[#ED1C24] text-base mt-2">
              {item.highLight}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-base text-[#337ab7] underline mt-2">
                  {restaurant.name}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full bg-[#E0E0E0] h-2"></View>
       
          <View className="p-4">
            <View className="flex flex-row space-x-4">
              <FontAwesome6 name="location-dot" size={24} color="black" />
              <Text className="text-base">
                <Text className="font-bold">Đặt chỗ</Text> (Để có chỗ trước khi
                đến)
              </Text>
            </View>
            <TouchableOpacity className="bg-[#F44236] p-4 mt-3 rounded">
              <Text className="text-white text-center text-base font-bold">
              Select now
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-full bg-[#E0E0E0] h-2"></View>
          <View className="p-4">
            <Text className="font-bold text-base">Điều kiện áp dụng</Text>
            <Text className="font-bold text-base">1. Ưu đãi</Text>
            <Text className="text-base">
            <Text className="text-[#B20606] font-bold text-base">- Giảm 10%/suất buffet (sau VAT)</Text> cho
              khách hàng: Sử dụng dịch vụ vào buổi trưa T2-T6 hàng tuần. Áp dụng
              đến hết 30/06/2024.
            </Text>
            <Text className="font-bold text-base">2. Quy định ưu đãi</Text>
            <Text className="text-base">
            - Ưu đãi được áp dụng tất cả các ngày lễ/tết trong năm, xem các ngày Lễ tết bên dưới.
            </Text>
            <Text className="text-base">
            - Ưu đãi không được áp dụng đồng thời cùng với các chương trình ưu đãi khác tại Nhà hàng.
            </Text>
            <Text className="font-bold text-base">3. Giá buffet đã bao gồm VAT</Text>
            <Text className="font-bold text-base">4. Thời gian bán:</Text>
            <Text className="text-base">
            - <Text className="font-bold">Buổi trưa</Text> các ngày <Text className="font-bold">T2-T6</Text> hàng tuần.
            </Text>
            <Text className="text-base">
            - Không bán vào các ngày Lễ tết, xem chi tiết các ngày bên dưới.
            </Text>
            <Text className="font-bold text-base">5. Quy định thời gian đặt chỗ trước:</Text>
            <Text className="text-base">
             - Thời gian đặt chỗ trước tối thiểu: 120 phút
            </Text>
            <Text className="font-bold text-base">6. Quy định thời gian giữ chỗ:</Text>
            <Text className="text-base">
            - Thời gian nhà hàng giữ chỗ tối đa: 30 phút
            </Text>
            <Text className="font-bold text-base">7. Quy định giá buffet:</Text>
            <Text className="text-base font-bold">
            - Quy định giá Buffet trẻ em:
            </Text>
            <Text>
            Dưới 4 tuổi: Miễn phí
            Từ 4 đến 6 tuổi: 227.000đ/suất
            Từ 7 đến 12 tuổi: 357.000đ/suất
            Từ 13 tuổi trở lên: Tính giá Buffet người lớn
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default FoodDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    backgroundColor: "#fff",
  },
  contentPadding: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  exclusiveText: {
    fontSize: 16,
    color: "#E84C3F",
  },
  subTitle: {
    fontSize: 16,
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  lineThrough: {
    textDecorationLine: "line-through",
    color: "#ccc",
  },
  discountText: {
    color: "#E84C3F",
  },
  highlightText: {
    color: "#ED1C24",
    fontSize: 16,
    marginTop: 8,
  },
  linkText: {
    color: "#337ab7",
    textDecorationLine: "underline",
    marginTop: 8,
  },
  divider: {
    height: 2,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#F44236",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  redText: {
    color: "#B20606",
    fontWeight: "bold",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    opacity: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: Colors.primary,
    height: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
