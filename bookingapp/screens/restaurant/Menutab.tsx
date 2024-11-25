import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Pressable,
} from "react-native";
import PopUp from "../../components/menu/Popup";
import Menu from "../../components/menu/Menu";
import { TabbedHeaderList } from "react-native-sticky-parallax-header";
import Colors from "../../constants/Colors";
import screenStyles from "../../constants/ScreenStyles";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Callout } from "react-native-maps";
import Octicons from "@expo/vector-icons/Octicons";
import ImageView from "react-native-image-viewing";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { API_URL } from "@env";
interface Item {
  _id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  openingHours: string;
  suggestions: Array<{
    title: string;
    items: Array<any>;
  }>;
  imagePrice: Array<{ image: string }>;
  location: { coordinates: [number, number] };
  album: Array<{ image: string }>;
}

interface RouteProps {
  item: Item;
  selectedItem: any;
  handlePresentModalPress?: () => void;
}

import { StackNavigationProp } from "@react-navigation/stack";
import { OrdersStackParamList } from "@/screens/type";
type MenutabNavigationProp = StackNavigationProp<OrdersStackParamList, "Order">;

const FirstRoute: React.FC<RouteProps> = ({ item, selectedItem }) => {
  const navigation = useNavigation<MenutabNavigationProp>();
  const handleItemSelect = (selectedItem: any) => {
    navigation.navigate("Order", { restaurant: item, selectedItem });
  };

  const hasItems = item.suggestions.some((suggestion) => suggestion.items.length > 0);

  return (
    <View style={styles.flexContainer}>
      <Text style={styles.sectionTitle}>Đề xuất</Text>
      <ScrollView>
        {!hasItems ? (
          <View style={styles.informationContainer}>
            <Text style={styles.header}>I. Đặt chỗ PasGo : Tư vấn - Giữ chỗ</Text>
            <View style={styles.contentContainer}>
              <Text style={styles.text}>
                - Quý khách vui lòng đặt chỗ trước ít nhất <Text style={styles.boldText}>60 phút</Text> để được phục vụ tốt nhất.
              </Text>
              <Text style={styles.text}>
                - Bàn đặt của Quý khách được giữ tối đa <Text style={styles.boldText}>15 phút</Text>
              </Text>
            </View>
            <Text style={styles.header}>II. Ưu đãi tặng kèm: Chương trình ưu đãi đang được xây dựng</Text>
            <Text style={styles.header}>III. Lưu ý</Text>
            <View style={styles.contentContainer}>
              <Text style={styles.text}>- Giá menu chưa bao gồm VAT. Nhà hàng luôn thu VAT theo Quy định hiện hành</Text>
            </View>
          </View>
        ) : (
          item.suggestions.map(
            (suggestion, index) =>
              suggestion.items.length > 0 && (
                <Menu
                  key={index}
                  items={suggestion.items}
                  title={suggestion.title}
                  onItemSelect={handleItemSelect}
                  restaurant={item}
                />
              )
          )
        )}
        <View style={styles.divider}></View>
      </ScrollView>
    </View>
  );
};

const SecondRoute: React.FC<RouteProps> = ({ item, selectedItem }) => (
  <ScrollView>
    <View style={styles.informationContainer}>
      <View style={styles.imageRow}>
        {item.imagePrice.map((menuImage, index) => (
          <View key={index} style={styles.imageItem}>
            <Image source={{ uri: menuImage.image }} style={styles.image} />
          </View>
        ))}
      </View>
    </View>
    <View style={styles.divider}></View>
  </ScrollView>
);

const ThirdRoute: React.FC<RouteProps> = ({ item }) => {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch restaurant data
    axios
      .get(`${API_URL}/restaurants/${item._id}`)
      .then((response) => {
        // Extract the main restaurant image and check its validity
        const mainImage = response.data.restaurant?.image;

        if (mainImage) {
          setGalleryImages([mainImage]); // Add the main image to the gallery
        } else {
          setError('No image found for this restaurant.');
        }

        setLoading(false); // Set loading to false after data is processed
      })
      .catch((err) => {
        console.error('Error fetching images:', err); // Log the error for debugging
        setError('Failed to load images');
        setLoading(false);
      });
  }, [item._id]); // Dependency on item._id ensures the effect is rerun when item changes

  if (loading) {
    return <Text>Loading restaurant images...</Text>; // More informative loading message
  }

  if (error) {
    return <Text>{error}</Text>; // Display error message if something went wrong
  }

  return (
    <ScrollView>
      <View style={styles.informationContainer}>
        <View style={styles.imageRow}>
          {galleryImages.map((imageUri, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.divider}></View>
    </ScrollView>
  );
};

const FourRoute: React.FC<RouteProps> = ({ item, selectedItem }) => {
  const { coordinates } = item.location;
  return (
    <View>
      <View style={styles.mapContainer}>
        <Text style={styles.sectionTitle}>Chỉ đường</Text>
        <View style={styles.locationRow}>
          <Octicons name="location" size={24} color="black" />
          <Text style={styles.locationText}>{item.address}</Text>
        </View>
        <Text style={styles.text}>{"(Nhấn vào ảnh bản đồ để xem chỉ đường)"}</Text>
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coordinates[1],
              longitude: coordinates[0],
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude: coordinates[1], longitude: coordinates[0] }}>
              <Callout>
                <Text>{item.name}</Text>
              </Callout>
            </Marker>
          </MapView>
        </View>
      </View>
      <View style={styles.divider}></View>
    </View>
  );
};

const FifthRoute: React.FC<RouteProps> = ({ item }) => {
  // Destructure openingHours from the item
  const openingHours = item.openingHours || "Không có thông tin"; // Default message if no openingHours

  return (
    <View>
      <View style={styles.informationContainer}>
        <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
        <View style={styles.dayHoursRow}>
          <Text style={styles.dayText}>{openingHours}</Text>
        </View>
      </View>
      <View style={styles.divider}></View>
    </View>
  );
};
const SixthRoute: React.FC<RouteProps> = ({ item, selectedItem }) => {
  const tags = [
    "Món Âu", "Hải sản", "Buffet", "Sang trọng", "Quận 2", "Gợi ý cho bạn", "Sắp xếp gợi ý", "Mức giá 250K - 500K"
  ];

  return (
    <View style={styles.infoSection}>
      <Text style={styles.sectionTitle}>Giới thiệu nhà hàng {item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.sectionTitle}>TAGS:</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tagItem}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

interface MenuTabProps {
  item: Item;
}

const MenuTab: React.FC<MenuTabProps> = ({ item }) => {
  const [index, setIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const routes = [
    { key: "first", title: "Ưu đãi" },
    { key: "second", title: "Bảng giá" },
    { key: "third", title: "Ảnh" },
    { key: "four", title: "Chỉ đường" },
    { key: "fifth", title: "Giờ hoạt động" },
    { key: "sixth", title: "Chi tiết" },
  ];

  const renderScene = SceneMap({
    first: () => <FirstRoute {...{ item, selectedItem }} />,
    second: () => <SecondRoute {...{ item, selectedItem }} />,
    third: () => <ThirdRoute {...{ item, selectedItem }} />,
    four: () => <FourRoute {...{ item, selectedItem }} />,
    fifth: () => <FifthRoute {...{ item, selectedItem }} />,
    sixth: () => <SixthRoute {...{ item, selectedItem }} />,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: useWindowDimensions().width }}
      swipeEnabled={true}
      lazy={true} 
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={styles.tabIndicator} // Indicator style
          style={styles.tabBar} // Tab bar background
          labelStyle={styles.tabLabel} // Tab label style
        />
      )}
    />
);
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20, // Tăng kích thước tiêu đề
    fontWeight: "700", // Đậm hơn để dễ nhận diện
    marginBottom: 15,
    color: Colors.primary, // Sử dụng màu chủ đạo cho tiêu đề
  },
  informationContainer: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    backgroundColor: "#f9f9f9", // Nền nhẹ cho các phần thông tin
    borderRadius: 10,
    marginBottom: 15,
  },
  text: {
    fontSize: 16, // Tăng kích thước chữ để dễ đọc hơn
    marginVertical: 8,
    color: "#555", // Màu sắc trung tính cho văn bản
  },
  boldText: {
    fontWeight: "700",
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 12,
    color: Colors.secondary, // Màu cho tiêu đề phụ
  },
  contentContainer: {
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Căn đều các hình ảnh
  },
  imageItem: {
    margin: 8,
    width: "30%",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160, // Điều chỉnh chiều cao hình ảnh cho hợp lý
    borderRadius: 8,
  },
  mapContainer: {
    flexDirection: "column",
    padding: 15,
    backgroundColor: "#f5f5f5", // Nền cho phần bản đồ
    borderRadius: 10,
    marginBottom: 15,
  },
  mapWrapper: {
    height: 260,
    marginVertical: 25,
    borderRadius: 10, // Bo tròn góc bản đồ
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  dayHoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayText: {
    fontSize: 16,
    marginVertical: 8,
    color: "#333", // Màu tối cho giờ hoạt động
  },
  infoSection: {
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    marginVertical: 12,
    color: "#666", // Màu cho mô tả nhà hàng
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tagItem: {
    margin: 6,
    backgroundColor: "#f0f0f0", // Màu nền cho tags
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    color: "#333", // Màu chữ cho tags
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555", // Màu văn bản địa chỉ
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  flexContainer: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff", // Màu chữ button
    fontWeight: "600",
  },
  tabBar: {
    backgroundColor: Colors.primary, // Tab bar background color
    height: 70, // Tab bar height
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff', // Tab label text color
  },
  tabIndicator: {
    backgroundColor: Colors.secondary, // Tab indicator color
    height: 3, // Height of the indicator
  },
});

export default MenuTab;
