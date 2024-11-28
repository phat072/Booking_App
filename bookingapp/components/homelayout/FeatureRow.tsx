import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../../theme";
import RestaurantCard from "../restaurant/RestaurantCard";
import RestaurantGridLayout from "../restaurant/RestaurantGridLayout";
import { FeatureScreenNavigationProp } from "../type";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");

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
        <View style={styles.rowContainer}>
          <View style={styles.row}>
            {rows[0].map((restaurant, index) => (
              <RestaurantGridLayout item={restaurant} key={`row1-${index}`} />
            ))}
          </View>
          <View style={[styles.row, styles.marginTop]}>
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
        <View style={styles.featureContainer}>
          <ImageBackground
            style={styles.featureImage}
            source={{
              uri: "https://pasgo.vn/Upload/anh-chi-tiet/slide-bo-to-quan-moc-vo-oanh-4-normal-2318786063427.webp",
            }}
            resizeMode="cover"
            imageStyle={styles.featureImageStyle}
          />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureSubTitle}>{subTitle}</Text>
            <TouchableOpacity
              style={styles.featureButton}
              onPress={() =>
                navigation.navigate("FeatureScreen", {
                  title,
                  subTitle,
                  restaurants,
                  layout,
                })
              }
            >
              <Text style={styles.featureButtonText}>Xem ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <>
          <View style={styles.featureHeader}>
            <View style={styles.featureHeaderTitle}>
              <Text style={styles.featureTitleText}>{title}</Text>
            </View>
            <TouchableOpacity
              style={styles.featureHeaderButton}
              onPress={() =>
                navigation.navigate("FeatureScreen", {
                  title,
                  subTitle,
                  restaurants,
                  layout,
                })
              }
            >
              <Text style={styles.featureHeaderButtonText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subTitleText}>{subTitle}</Text>
        </>
      );
    }
  };

  return (
    <View>
      <View style={styles.featureWrapper}>{renderFeature()}</View>
      <View style={styles.scrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderLayout()}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
  },
  marginTop: {
    marginTop: 10,
  },
  featureContainer: {
    backgroundColor: "white",
    height: 310,
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    borderRadius: 5,
  },
  featureImage: {
    height: 150,
  },
  featureImageStyle: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  featureTextContainer: {
    padding: 12,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  featureSubTitle: {
    fontSize: 14,
    color: "#404040",
  },
  featureButton: {
    padding: 7,
    backgroundColor: Colors.primary,
    marginTop: 16,
    borderRadius: 50,
  },
  featureButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureHeaderTitle: {
    width: "75%",
  },
  featureTitleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  featureHeaderButton: {
    width: "25%",
    marginLeft: 8,
  },
  featureHeaderButtonText: {
    color: themeColors.text,
    fontSize: 18,
    fontWeight: "500",
    textDecorationLine: 'underline'
  },
  subTitleText: {
    fontSize: 14,
    color: "#404040",
  },
  featureWrapper: {
    paddingHorizontal: 12,
  },
  scrollWrapper: {
    paddingHorizontal: 12,
  },
  scrollContent: {
    paddingVertical: 16,
  },
});
