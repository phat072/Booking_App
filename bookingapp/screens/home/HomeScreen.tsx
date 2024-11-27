import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import Colors from "@/constants/Colors";
import Categories from "../../components/homelayout/Categories";
import FeaturedRow from "../../components/homelayout/FeatureRow";
import * as Icon from "react-native-feather";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { API_URL } from "@env";
import { UserType } from "../../userContext";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Banner from "../../components/homelayout/Banner";
import { Skeleton } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "react-native-elements";

// Define types for the expected data
interface FeaturedData {
  title: string;
  restaurants: any[]; // You can define a more specific type based on your restaurant object structure
  subTitle?: string;
  layout?: string; // Adjust according to your layout types
}

interface DecodedToken {
  userId: string;
}

declare module "jwt-decode" {
    export default function jwtDecode(token: string): any;
}


export default function HomeScreen({ navigation, route }: { navigation: any; route: any }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, setUserId, user, updateUser } = useContext(UserType);
  const [address, setAddress] = useState<any[]>([]); // Adjust type based on your address object structure
  const [categories, setCategories] = useState<any[]>([]); // Adjust type based on your category object structure
  const [selectedCity, setSelectedCity] = useState<string>("TPHCM");

  useEffect(() => {
    if (route.params?.selectedCity) {
      setSelectedCity(route.params.selectedCity);
    }
  }, [route.params?.selectedCity]);
  const [featuredData, setFeaturedData] = useState<FeaturedData[]>([]);

  const bannerImages: string[] = [
    "https://pastaxi-manager.onepas.vn/Photo/ShowPhotoBannerVsSlide?Id=5AC03585-1C3B-4F28-B708-01337E3904E9&2023-12-18%2016:12:30",
    "https://pastaxi-manager.onepas.vn/Photo/ShowPhotoBannerVsSlide?Id=DBEFFE71-6DCE-4F40-8A31-6D4F72A30B90&2023-12-18%2016:12:30",
    "https://pastaxi-manager.onepas.vn/Photo/ShowPhotoBannerVsSlide?Id=7F14089A-CF08-4FA4-B04F-9FAA31B9CE02&2023-12-18%2016:12:30",
    "https://pastaxi-manager.onepas.vn/Photo/ShowPhotoBannerVsSlide?Id=FC15E6C4-5E82-42E6-8A1D-C724DA4E6E36&2023-12-18%2016:12:30",
  ];

  const fetchFeaturedData = async (retryCount: number = 3) => {
    try {
      const response = await axios.get(`${API_URL}/api/featured`);
      setFeaturedData(response.data);
      setIsLoading(false);
    } catch (error) {
      if (retryCount > 0) {
        // console.warn(`Retrying... ${retryCount} attempts left`);
        fetchFeaturedData(retryCount - 1);
      } else {
        // console.error("Failed to fetch featured data:", error);
        setError("Failed to fetch featured data.");
        setIsLoading(false);
      }
    }
  };

  const fetchAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken: DecodedToken = jwt_decode(token || "");
      const userId = decodedToken.userId;
      setUserId(userId);
      await fetchAddressData(userId);
    } catch (error) {
      // console.log("Error fetching address", error);
      setError("Failed to fetch address.");
    }
  };

  const fetchAddressData = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/address/${userId}`);
      const addressData = response.data;
      updateUser(addressData);
      // console.log(addressData, "user fetch");
    } catch (error) {
      // console.log(`${API_URL}/address/${userId}`);
      // console.log("Error fetching address data", error);
      setError("Failed to fetch address data.");
    }
  };

  const fetchCategories = async (retryCount: number = 3) => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      const fetchedCategories = response.data;
      setCategories(fetchedCategories);
      setIsLoading(false);
    } catch (error) {
      if (retryCount > 0) {
        console.warn(`Retrying... ${retryCount} attempts left`);
        fetchCategories(retryCount - 1);
      } else {
        // console.error("Error fetching categories:", error);
        setError("Failed to fetch categories.");
        setIsLoading(false);
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    fetchFeaturedData();
    fetchAddress();
    fetchCategories();
  };

  useEffect(() => {
    fetchFeaturedData();
    fetchAddress();
    fetchCategories();
  }, []);

  const styles = StyleSheet.create({
    headerText: {
      fontWeight: 'bold',
      fontSize: 20,
      paddingLeft: 16,
      marginTop: 8,
    },
    skeletonCategory: {
      flexDirection: 'row',
      padding: 20,
      justifyContent: 'space-between',
    },
  });

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
  <StatusBar barStyle="dark-content" />
  {/* header  */}
  <View style={{ justifyContent: 'space-between', padding: 16, flexDirection: 'row', alignItems: 'center', maxWidth: '100%', height: 56 }}>
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("City", { selectedCity, setSelectedCity })
      }
    >
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="location-sharp" size={24} color={Colors.primary} />
        <Text
          style={{
            textTransform: 'uppercase',
            fontSize: 17,
            marginLeft: 10,
            fontWeight: 'bold',
            marginRight: 5,
            color: Colors.primary,
          }}
        >
          {selectedCity}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
      <EvilIcons name="bell" size={30} color="black" />
    </TouchableOpacity>
  </View>
  {/* search bar */}
  <TouchableOpacity onPress={() => navigation.navigate("Search")}>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 }}>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: 'gray',
          padding: 7,
        }}
        onPress={() => navigation.navigate("Search")}
      >
        <Icon.Search height="25" width="25" stroke="gray" />
        <Text
          style={{
            marginLeft: 10,
            flex: 1,
            color: Colors.grey,
            fontSize: 16,
          }}
        >
          Tìm kiếm địa chỉ, món ăn...
        </Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
  {/* main */}
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 100,
    }}
  >
    <Text style={{ fontWeight: 'bold', fontSize: 20, paddingLeft: 16, marginTop: 8 }}>Danh mục</Text>
    {/* skeleton category */}
    {isLoading ? (
      <View style={styles.skeletonCategory}>
        <Skeleton
          circle
          LinearGradientComponent={LinearGradient}
          animation="wave"
          width={65}
          height={65}
        />
        <Skeleton
          circle
          LinearGradientComponent={LinearGradient}
          animation="wave"
          width={65}
          height={65}
        />
        <Skeleton
          circle
          LinearGradientComponent={LinearGradient}
          animation="wave"
          width={65}
          height={65}
        />
        <Skeleton
          circle
          LinearGradientComponent={LinearGradient}
          animation="wave"
          width={65}
          height={65}
        />
      </View>
    ) : (
      <Categories categories={categories} />
    )}
    {/* skeleton banner */}
    {isLoading ? (
      <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' }}>
        <Skeleton
          LinearGradientComponent={LinearGradient}
          animation="wave"
          width={100}
          height={150}
        />
      </View>
    ) : (
      <Banner images={bannerImages} />
    )}
    {/* featured rows */}
    {isLoading ? (
      <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' }}>
        <Skeleton
          LinearGradientComponent={LinearGradient}
          animation="wave"
          width={200}
          height={300}
        />
      </View>
    ) : (
      featuredData.map((featured, index) => (
        <FeaturedRow
          key={index}
          title={featured.title}
          restaurants={featured.restaurants}
          subTitle={featured.subTitle || ""}
          layout={featured.layout ? parseInt(featured.layout) : 0}
          // navigation={navigation}
        />
      ))
    )}
    {/* Handle errors */}
    {error && (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
        <Text style={{ color: Colors.primary }}>{error}</Text>
        <TouchableOpacity onPress={handleRetry}>
          <Text style={{ color: 'blue', marginLeft: 8 }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )}
  </ScrollView>
</SafeAreaView>
    );
}
