import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

// Define a type for navigation params
type RootStackParamList = {
  RestaurantDetail: { [key: string]: any };
};

// Define props type for RestaurantGridLayout component
interface RestaurantGridLayoutProps {
  item: {
    name: string;
    image?: string;
    rating: number;
    address: string;
    promotions: string;
  };
  layout?: any;
}

export default function RestaurantGridLayout({ item, layout }: RestaurantGridLayoutProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength - 3)}...` : text;
  };

  const handlePress = () => {
    navigation.navigate("RestaurantDetail", { ...item });
    navigation.setParams({ headerTitle: item.name });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image || "default_image_url" }}
            style={styles.image}
          />
          <View style={styles.infoContainer}>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={18} color="#DDBC37" />
              <Text style={styles.ratingText}>
                {item.rating} |{" "}
                <Text style={styles.priceText}>$$</Text>
              </Text>
            </View>
            <View style={styles.distanceContainer}>
              <Entypo name="map" size={18} color="#3D9DC3" />
              <Text style={styles.distanceText}>4.2 Km</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>Được đề xuất</Text>
          </View>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.addressText}>{item.address}</Text>
          <Text style={styles.promotionsText}>{item.promotions}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity>
              <Text style={styles.reserveButton}>Đặt chỗ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#B7B7B7",
    width: "95%",
    height: 200,
    marginRight: 10
  },
  imageContainer: {
    marginRight: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 8,
  },
  priceText: {
    color: "#FF7F27",
    fontWeight: "bold",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  distanceText: {
    marginLeft: 8,
  },
  detailsContainer: {
    width: 240,
    height: 160,
  },
  recommendedBadge: {
    backgroundColor: "#FCECEE",
    padding: 4,
    width: 80,
    borderRadius: 8,
  },
  recommendedText: {
    fontSize: 12,
    color: "#C34039",
    textAlign: "center",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  addressText: {
    marginTop: 6,
    color: "#6B6B6B",
  },
  promotionsText: {
    marginTop: 6,
    color: "#E15241",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 8,
  },
  reserveButton: {
    width: "33%",
    textAlign: "center",
    padding: 6,
    borderColor: "#BF3431",
    borderWidth: 1,
    borderRadius: 4,
    color: "#BF3431",
    fontSize: 14,
  },
});
