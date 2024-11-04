import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React from "react";
import { themeColors } from "../../theme";
import * as Icon from "react-native-feather";
import { useNavigation, NavigationProp } from "@react-navigation/native";

// Định nghĩa loại cho Restaurant
interface Restaurant {
  id: string; // ID của món ăn
  name: string;
  image: string;
  rating: number; // Đánh giá là số
  address: string;
}

// Định nghĩa loại cho RestaurantCardProps
interface RestaurantCardProps {
  item: Restaurant;
}

// Định nghĩa kiểu cho tham số điều hướng
interface RestaurantScreenParams {
  id: string;
  name: string;
  image: string;
  rating: number;
  address: string;
  headerTitle: string; // Thêm headerTitle vào tham số
}

// Định nghĩa Navigation Prop
type RootStackParamList = {
  Restaurant: RestaurantScreenParams; // Định nghĩa màn hình Restaurant với các tham số tương ứng
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({ item }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "...";
    }
    return text;
  };

  const handlePress = () => {
    // Chuyển đổi tham số sang kiểu đã định nghĩa
    navigation.navigate("Restaurant", { ...item, headerTitle: item.name });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={{
          marginRight: 24,
          backgroundColor: "white",
          borderRadius: 24,
          shadowColor: themeColors.bgColor(0.2),
          shadowRadius: 7,
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        }}
      >
        <Image
          style={{
            height: 144,
            width: 256,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
          source={{ uri: item.image }}
        />
        <View style={{ paddingHorizontal: 12, paddingBottom: 16, paddingTop: 8 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 18, fontWeight: "bold" }}
          >
            {truncateText(item.name, 28)}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Image
              source={require("../assets/img/star.png")}
              style={{ height: 16, width: 16 }}
            />
            <Text style={{ fontSize: 12, marginLeft: 4 }}>
              <Text style={{ color: "green" }}>{item.rating}</Text>
              <Text style={{ color: "gray" }}> đánh giá </Text>
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Icon.MapPin color="gray" width={15} height={15} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "gray", fontSize: 12, marginLeft: 4 }}
            >
              Địa chỉ · {truncateText(item.address, 30)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RestaurantCard;