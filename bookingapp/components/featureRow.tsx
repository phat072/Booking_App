import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
  } from "react-native";
  import React from "react";
  import { themeColors } from "../theme";
  import RestaurantCard from "./restaurant/restaurantCard";
  import RestaurantGridLayout from "./restaurant/restaurantGridLayout";
  import { useNavigation } from "@react-navigation/native";
  
  // Define props types
  interface Restaurant {
    id: string;
    name: string;
    image: string;
    rating: number;
    address: string;
  }
  
  interface FeatureRowProps {
    title: string;
    subTitle: string;
    restaurants: Restaurant[];
    layout: number;
  }
  
  const FeatureRow: React.FC<FeatureRowProps> = ({
    title,
    subTitle,
    restaurants,
    layout,
  }) => {
    const navigation = useNavigation();
    const rows: Restaurant[][] = [[], []];
  
    restaurants.forEach((restaurant, index) => {
      rows[index % 2].push(restaurant);
    });
  
    const renderLayout = () => {
      if (layout === 1) {
        return (
          <View style={styles.layoutContainer}>
            <View style={styles.row}>
              {rows[0].map((restaurant, index) => (
                <RestaurantGridLayout item={restaurant} key={`row1-${index}`} />
              ))}
            </View>
            <View style={[styles.row, { marginTop: 10 }]}>
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
              style={styles.imageBackground}
              source={{
                uri: "https://pasgo.vn/Upload/anh-chi-tiet/slide-bo-to-quan-moc-vo-oanh-4-normal-2318786063427.webp",
              }}
              resizeMode="cover"
              imageStyle={styles.imageStyle}
            />
            <View style={styles.featureContent}>
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
                <Text style={styles.buttonText}>Xem ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        return (
          <>
            <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>
              <TouchableOpacity
                style={styles.seeAllButton}
                onPress={() =>
                  navigation.navigate("FeatureScreen", {
                    title,
                    subTitle,
                    restaurants,
                    layout,
                  })
                }
              >
                <Text style={[styles.seeAllText, { color: themeColors.text }]}>
                  Xem tất cả
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subTitle}>{subTitle}</Text>
          </>
        );
      }
    };
  
    return (
      <View>
        <View style={styles.featureWrapper}>{renderFeature()}</View>
        <View style={styles.scrollViewWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {renderLayout()}
          </ScrollView>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    layoutContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
    },
    row: {
      flexDirection: "row",
    },
    featureContainer: {
      backgroundColor: "#FFFFFF",
      height: 390,
      shadowColor: "#000000",
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 8,
      borderRadius: 5,
    },
    imageBackground: {
      height: 192,
    },
    imageStyle: {
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    },
    featureContent: {
      flex: 1,
      padding: 12,
    },
    featureTitle: {
      fontSize: 24,
      fontWeight: "bold",
    },
    featureSubTitle: {
      fontSize: 16,
    },
    featureButton: {
      padding: 8,
      backgroundColor: "#FF0000",
      marginTop: 16,
      borderRadius: 25,
    },
    buttonText: {
      color: "#FFFFFF",
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    titleContainer: {
      width: "75%",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    seeAllButton: {
      width: "25%",
      marginLeft: 8,
    },
    seeAllText: {
      fontSize: 16,
      fontWeight: "500",
    },
    subTitle: {
      color: "#404040",
      fontSize: 16,
    },
    featureWrapper: {
      paddingHorizontal: 12,
    },
    scrollViewWrapper: {
      paddingHorizontal: 12,
    },
    scrollViewContent: {
      paddingTop: 20,
      overflow: "visible",
    },
  });
  
  export default FeatureRow;
  