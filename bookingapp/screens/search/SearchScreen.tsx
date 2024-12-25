import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OrdersStackParamList } from "@/screens/type"; // Thay đổi đường dẫn này theo cấu trúc project
import { API_URL } from "@env";
import Colors from "@/constants/Colors";

type SearchScreenNavigationProp = StackNavigationProp<
  OrdersStackParamList,
  "RestaurantDetail"
>;

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  image: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  distance?: number; // Khoảng cách (tính bằng km)
}

const SearchScreen: React.FC = () => {
  const [keyword, setKeyword] = useState<string>(""); // Từ khóa tìm kiếm
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // Danh sách nhà hàng tìm kiếm
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]); // Danh sách nhà hàng gần
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null); // Tọa độ hiện tại của người dùng
  const navigation = useNavigation<SearchScreenNavigationProp>();

  // Công thức Haversine để tính khoảng cách
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Bán kính trái đất (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Khoảng cách tính bằng km
  };

  // Lấy vị trí hiện tại của người dùng
  const fetchCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Thông báo",
          "Ứng dụng cần quyền truy cập vị trí để sử dụng tính năng này."
        );
        return null;
      }
      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lấy vị trí hiện tại của bạn.");
      return null;
    }
  };

  // Lấy danh sách nhà hàng gần
  const fetchNearbyRestaurants = async () => {
    setLoading(true);
    try {
      const location = await fetchCurrentLocation();
      if (!location) return;
  
      setCurrentLocation(location);
  
      const response = await axios.get(
        `${API_URL}/restaurants?lat=${location.latitude}&lng=${location.longitude}&limit=5`
      );
  
      // Tính khoảng cách (nếu BE không trả về)
      const updatedRestaurants = response.data.map((restaurant: Restaurant) => {
        const [lng, lat] = restaurant.location.coordinates;
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          lat,
          lng
        );
        return { ...restaurant, distance };
      });
  
      // Sắp xếp các nhà hàng theo khoảng cách gần nhất và lấy 5 nhà hàng đầu tiên
      const sortedRestaurants = updatedRestaurants.sort(
        (a: Restaurant, b: Restaurant) => a.distance! - b.distance!
      );
  
      setNearbyRestaurants(sortedRestaurants.slice(0, 4)); // Chỉ lấy top 5 nhà hàng gần nhất
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lấy danh sách nhà hàng gần bạn.");
    } finally {
      setLoading(false);
    }
  };
  

  // Lấy danh sách nhà hàng gần khi mở tab
  useEffect(() => {
    if (!keyword.trim()) {
      fetchNearbyRestaurants(); // Chỉ gọi khi từ khóa rỗng
    }
  }, [keyword]);

  // Hàm tìm kiếm nhà hàng
  const handleSearch = async () => {
    if (!keyword.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }

    setLoading(true);
    try {
      const location = await fetchCurrentLocation();
      if (!location) return;

      setCurrentLocation(location);

      const response = await axios.get(
        `${API_URL}/restaurants/search/${encodeURIComponent(keyword)}`
      );

      // Tính khoảng cách (nếu BE không trả về)
      const updatedRestaurants = response.data.map((restaurant: Restaurant) => {
        const [lng, lat] = restaurant.location.coordinates;
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          lat,
          lng
        );
        return { ...restaurant, distance };
      });

      setRestaurants(updatedRestaurants || []);
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm điều hướng tới trang chi tiết
  const navigateToDetail = (item: any) => {
    navigation.navigate("RestaurantDetail", item);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tìm kiếm nhà hàng</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nhập từ khóa (ví dụ: nhà, quán ăn...)"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch} // Tìm kiếm khi nhấn Enter
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        ) : (
          <>
            {!keyword.trim() && (
              <>
                <Text style={styles.sectionTitle}>Nhà hàng gần bạn</Text>
                <FlatList
                  data={nearbyRestaurants}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.restaurantItem}
                      onPress={() => navigateToDetail(item)}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.restaurantImage}
                        resizeMode="cover"
                      />
                      <View style={styles.restaurantInfo}>
                        <Text style={styles.restaurantName}>{item.name}</Text>
                        <Text style={styles.restaurantAddress}>
                          {item.address}
                        </Text>
                        <Text style={styles.restaurantDistance}>
                          Cách bạn: {item.distance?.toFixed(2)} km
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.noResults}>
                      Không tìm thấy nhà hàng gần bạn.
                    </Text>
                  )}
                />
              </>
            )}

            {keyword.trim() && (
              <>
                <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
                <FlatList
                  data={restaurants}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.restaurantItem}
                      onPress={() => navigateToDetail(item)}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.restaurantImage}
                        resizeMode="cover"
                      />
                      <View style={styles.restaurantInfo}>
                        <Text style={styles.restaurantName}>{item.name}</Text>
                        <Text style={styles.restaurantAddress}>
                          {item.address}
                        </Text>
                        <Text style={styles.restaurantDistance}>
                          Cách bạn: {item.distance?.toFixed(2)} km
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.noResults}>
                      Không tìm thấy nhà hàng nào.
                    </Text>
                  )}
                />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#ffffff" },
  titleContainer: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    alignItems: "center",
  },
  title: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  container: { padding: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  restaurantItem: {
    flexDirection: "row",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  restaurantImage: { width: 100, height: 100 },
  restaurantInfo: { flex: 1, padding: 10 },
  restaurantName: { fontWeight: "bold", fontSize: 16 },
  restaurantAddress: { color: "#555", fontSize: 14 },
  restaurantDistance: { color: "#007AFF", fontSize: 14 },
  loader: { marginTop: 20 },
  noResults: { textAlign: "center", marginTop: 20 },
});

export default SearchScreen;