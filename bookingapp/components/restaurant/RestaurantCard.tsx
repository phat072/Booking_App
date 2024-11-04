import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { themeColors } from "../../theme";
import * as Icon from "react-native-feather";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RestaurantCardProps = {
  item: {
    name: string;
    image: string;
    rating: number;
    address: string;
  };
  layout: number;
};

export default function RestaurantCard({ item, layout }: RestaurantCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
  };

  const handlePress = () => {
    navigation.navigate("RestaurantDetail", { ...item });
    navigation.setParams({ headerTitle: item.name });
  };

  const renderLayout = () => {
    if (layout === 2) {
      return (
        <View style={styles.layoutTwoContainer}>
          <Image style={styles.layoutTwoImage} source={{ uri: item.image }} />
          <View style={styles.layoutTwoTextContainer}>
            <Text style={styles.layoutTwoTitle}>{item.name}</Text>
          </View>
        </View>
      );
    } else if (layout === 3) {
      return (
        <View
          style={[
            styles.layoutThreeContainer,
            { shadowColor: themeColors.bgColor(0.2) },
          ]}
        >
          <Image style={styles.layoutThreeImage} source={{ uri: item.image }} />
          <View style={styles.layoutThreeTextContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.layoutThreeTitle}>
              {truncateText(item.name, 28)}
            </Text>
            <View style={styles.ratingContainer}>
              <Image source={require("../../assets/img/star.png")} style={styles.starIcon} />
              <Text style={styles.ratingText}>
                <Text style={styles.ratingValue}>{item.rating}</Text>
                <Text style={styles.ratingLabel}> đánh giá </Text>
              </Text>
            </View>
            <View style={styles.addressContainer}>
              <Icon.MapPin color="gray" width={15} height={15} />
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressText}>
                Địa chỉ · {truncateText(item.address, 30)}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {renderLayout()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  layoutTwoContainer: {
    marginRight: 16,
  },
  layoutTwoImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  layoutTwoTextContainer: {
    width: 144,
  },
  layoutTwoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 8,
  },
  layoutThreeContainer: {
    marginRight: 24,
    backgroundColor: "white",
    borderRadius: 16,
    shadowRadius: 7,
  },
  layoutThreeImage: {
    height: 144,
    width: 256,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  layoutThreeTextContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 8,
  },
  layoutThreeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  starIcon: {
    height: 16,
    width: 16,
  },
  ratingText: {
    fontSize: 12,
  },
  ratingValue: {
    color: "green",
  },
  ratingLabel: {
    color: "gray",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  addressText: {
    color: "gray",
    fontSize: 12,
  },
});
