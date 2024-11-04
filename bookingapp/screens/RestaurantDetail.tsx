import {
    View,
    Text,
    StatusBar,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
  } from "react-native";
  import { Ionicons } from "@expo/vector-icons";
  import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
  import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
  import MenuTab from "./MenuTab/MenuTab";
  import NetworkImage from "../components/NetworkImage";
  import { SIZES } from "../constants/theme";
  import PopUp from "../components/PopUp";
  import { FontAwesome5 } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  import { useAnimatedRef } from "react-native-reanimated";
  import Colors from "../constants/Colors";
  import { UserType, UserContextType } from "../userContext";
  import axios from "axios";
  import { API_URL } from "@env";
  import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
  } from "@gorhom/bottom-sheet";
  
  // Define types for item and route params
  interface RestaurantDetailParams {
    name: string;
    _id: string;
    image: string;
    address: string;
    rating: number;
  }
  
  interface RestaurantDetailRouteProp extends RouteProp<{ params: RestaurantDetailParams }, 'params'> {}
  
  export default function RestaurantDetail() {
    const route = useRoute<RestaurantDetailRouteProp>();
    const navigation = useNavigation();
    const item = route.params;
    const { name, _id } = item;
    const scrollRef = useAnimatedRef<ScrollView>();
    const { user, updateUser } = useContext(UserType) as UserContextType;
  
    const [isFavorite, setIsFavorite] = useState(false);
    const restaurantId = item._id;
    const userId = user?._id;
  
    if (!item || !_id) {
      console.error("Item or _id is undefined in RestaurantDetail");
      return <Text>Error: Item not found</Text>;
    }
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: () => (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontWeight: "bold", fontSize: 18, color: "white" }}
          >
            {name}
          </Text>
        ),
        headerRight: () => (
          <View style={styles.bar}>
            <TouchableOpacity style={styles.roundButton}>
              <Ionicons name="share-outline" size={22} color={"#000"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFavoritePress}
              style={styles.roundButton}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "red" : "black"}
              />
            </TouchableOpacity>
          </View>
        ),
      });
    }, [isFavorite]);
  
    useEffect(() => {
      const checkFavoriteStatus = async () => {
        if (user && user.favoriteRestaurants) {
          setIsFavorite(user.favoriteRestaurants.includes(restaurantId));
        }
      };
  
      checkFavoriteStatus();
    }, [user, restaurantId]);
  
    const handleFavoritePress = async () => {
      try {
        const response = await axios.post(`${API_URL}/addToFavorites`, {
          userId,
          restaurantId,
        });
  
        if (response.status === 200) {
          if (response.data.message === "Restaurant already in favorites") {
            Alert.alert("Thông báo", "Nhà hàng đã có trong danh sách yêu thích");
          } else {
            setIsFavorite(true);
            updateUser((prevUser) => ({
              ...prevUser,
              favoriteRestaurants: [
                ...prevUser.favoriteRestaurants,
                restaurantId,
              ],
            }));
          }
        } else {
          console.warn("Error adding to favorites");
        }
      } catch (error) {
        console.error("Error handling favorite:", error);
      }
    };
  
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const snapPoints = React.useMemo(() => ["25%", "50%"], []);
  
    const handlePresentModalPress = React.useCallback(() => {
      bottomSheetRef.current?.present();
    }, []);
    const handleSheetChanges = React.useCallback((index: number) => {
      console.log("handleSheetChanges", index);
    }, []);
  
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </BottomSheetView>
        </BottomSheetModal>
  
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: "#ffffff" }}>
            <NetworkImage
              source={{ uri: item.image }}
              height={SIZES.height / 5.5}
              width={SIZES.width}
              border={30}
            />
            <View style={styles.popupContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}>{item.name}</Text>
              <Text style={{ color: "#A0A0A0", textAlign: "center" }}>{item.address}</Text>
              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5 name="door-open" size={24} color="#A0C69D" />
                    <Text style={{ marginLeft: 5 }}>Đang mở cửa</Text>
                  </View>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.truncateText}>
                    Gọi món Việt, Buffet nướng hàn quốc
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign name="star" size={24} color="gold" />
                    <Text style={{ marginLeft: 5 }}>{item.rating}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}>
                    <Ionicons name="location-sharp" size={24} color="red" />
                    <Text>4.5 km</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <MenuTab
              item={item}
              handlePresentModalPress={handlePresentModalPress}
            />
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 5,
              right: 0,
              left: 0,
            }}
          >
            <PopUp
              buttonText="Book"
              onPress={() => {
                navigation.navigate("Order", { restaurant: item }); // assuming `item` is the restaurant data
              }}
            />
          </View>
        </View>
      </BottomSheetModalProvider>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
    },
    truncateText: {
      maxWidth: 150,
      overflow: "hidden",
    },
    roundButton: {
      width: 40,
      height: 40,
      borderRadius: 50,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      color: Colors.primary,
    },
    bar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    popupContainer: {
      position: "absolute",
      top: 80,
      backgroundColor: "white",
      borderTopColor: "#ccc",
      borderTopWidth: 1,
      padding: 10,
      margin: 10,
      width: "95%",
      height: 145,
      borderRadius: 5,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowColor: "#000000",
      elevation: 4,
    },
  });
  