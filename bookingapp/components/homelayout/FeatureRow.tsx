import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../../theme";
import RestaurantCard from "../restaurant/RestaurantCard";
import RestaurantGridLayout from "../restaurant/RestaurantGridLayout";
import { FeatureScreenNavigationProp } from "../type";

// Define the types for the props
interface FeatureRowProps {
  title: string;
  subTitle: string;
  restaurants: Array<{ id: number; name: string; image: string; rating: number; address: string }>;
  layout: number;
}

export default function FeatureRow({
  title,
  subTitle,
  restaurants,
  layout,
}: FeatureRowProps) {
    const navigation = useNavigation<FeatureScreenNavigationProp>();
    const rows: [any[], any[]] = [[], []];
  
  restaurants.forEach((restaurant, index) => {
    rows[index % 2].push(restaurant);
  });

  const renderLayout = () => {
    if (layout === 1) {
      return (
        <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            {rows[0].map((restaurant, index) => (
              <RestaurantGridLayout item={restaurant} key={`row1-${index}`} />
            ))}
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            {rows[1].map((restaurant, index) => (
              <RestaurantGridLayout item={restaurant} key={`row2-${index}`} />
            ))}
          </View>
        </View>
      );
    } else if (layout === 2 || layout === 3) {
      return restaurants.map((restaurant, index) => (
        <RestaurantCard item={restaurant} key={index} layout={layout} />
      ));
    } else if (layout === 4) {
      return <View />;
    }
  };

  const renderFeature = () => {
    if (layout === 4) {
      return (
        <View
          className="bg-[#FFFFFF] h-[390]"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 8,
            borderRadius: 5,
          }}
        >
          <ImageBackground
            className="h-48"
            source={{
              uri: "https://pasgo.vn/Upload/anh-chi-tiet/slide-bo-to-quan-moc-vo-oanh-4-normal-2318786063427.webp",
            }}
            resizeMode="cover"
            imageStyle={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
          />
          <View className="flex p-3">
            <Text className="text-2xl font-bold">{title}</Text>
            <Text className="text-base">{subTitle}</Text>
            <TouchableOpacity
              className="p-2 bg-red-500 mt-4"
              style={{ borderRadius: 50 }}
              onPress={() =>
                navigation.navigate("FeatureScreen", {
                  title,
                  subTitle,
                  restaurants,
                  layout,
                })
              }
            >
              <Text className="text-white text-center text-xl font-bold">Xem ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <>
          <View className="flex-row items-center">
            <View className="w-9/12">
              <Text className="font-bold text-xl">{title}</Text>
            </View>
            <TouchableOpacity
              className="w-3/12 ml-2"
              onPress={() =>
                navigation.navigate("FeatureScreen", {
                  title,
                  subTitle,
                  restaurants,
                  layout,
                })
              }
            >
              <Text style={{ color: themeColors.text }} className="text-base font-medium">
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-[#404040] text-base">{subTitle}</Text>
        </>
      );
    }
  };

  return (
    <View>
      <View className="px-3">{renderFeature()}</View>
      <View className="px-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{}}
          className="overflow-visible py-5"
        >
          {renderLayout()}
        </ScrollView>
      </View>
    </View>
  );
}
