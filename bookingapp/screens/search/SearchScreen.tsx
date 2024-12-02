import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OrdersStackParamList } from "@/screens/type"; // Thay đổi đường dẫn này theo cấu trúc project
import { API_URL } from "@env";
import Colors from "@/constants/Colors";

type SearchScreenNavigationProp = StackNavigationProp<
  OrdersStackParamList,
  "RestaurantDetail"
>;

const SearchScreen: React.FC = () => {
  const [keyword, setKeyword] = useState<string>(""); // Từ khóa tìm kiếm
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading
  const [restaurants, setRestaurants] = useState<any[]>([]); // Danh sách nhà hàng
  const navigation = useNavigation<SearchScreenNavigationProp>();

  // Hàm tìm kiếm nhà hàng
  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/restaurants/search/${encodeURIComponent(keyword)}`
      );

      setRestaurants(response.data || []); // Cập nhật kết quả
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
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
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.restaurantItem}
              onPress={() => navigateToDetail(item)}
            >
              {/* Hình ảnh nhà hàng */}
              <Image
                source={{ uri: item.image }}
                style={styles.restaurantImage}
                resizeMode="cover"
              />
              <View style={styles.restaurantInfo}>
                {/* Tên nhà hàng */}
                <Text style={styles.restaurantName}>{item.name}</Text>
                {/* Địa chỉ nhà hàng */}
                <Text style={styles.restaurantAddress}>{item.address}</Text>
                {/* Loại món ăn */}
                <Text style={styles.restaurantType}>
                  Loại món: {item.type?.name || "Không xác định"}
                </Text>
                {/* Đánh giá */}
                <Text style={styles.restaurantRating}>
                  Đánh giá: {item.rating || 0}⭐
                </Text>
                {/* Khuyến mãi */}
                {item.promotions && (
                  <Text style={styles.restaurantPromotions}>
                    {item.promotions}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.noResults}>Không tìm thấy nhà hàng nào.</Text>
          )}
        />
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  titleContainer: {
    backgroundColor: Colors.primary, // Màu nền đỏ cho container title
    paddingVertical: 20,    // Padding cho chiều dọc
    alignItems: "center",   // Căn giữa theo chiều ngang
    justifyContent: "center", // Căn giữa theo chiều dọc
    width: "100%",          // Chiều rộng đầy đủ
    marginBottom: 16,       // Khoảng cách giữa tiêu đề và các thành phần bên dưới
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff", // Màu chữ trắng
  },
  container: {
    flex: 1,
    paddingHorizontal: 16, // Padding cho container chính
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
  restaurantItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  restaurantAddress: {
    fontSize: 14,
    color: "#555",
  },
  restaurantType: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#777",
  },
  restaurantRating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gold",
  },
  restaurantPromotions: {
    fontSize: 14,
    color: "green",
    marginTop: 4,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default SearchScreen;
