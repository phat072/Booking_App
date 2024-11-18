import React, { useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
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

// Define prop types
interface Item {
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
  handlePresentModalPress?: () => void;
}


import { StackNavigationProp } from "@react-navigation/stack";
import { OrdersStackParamList } from "@/screens/type";
type MenutabNavigationProp = StackNavigationProp<OrdersStackParamList, "Order">;

const FirstRoute: React.FC<RouteProps> = ({ item }) => {
  const navigation = useNavigation<MenutabNavigationProp>();
  const handleItemSelect = (selectedItem: any) => {
    navigation.navigate("Order", { restaurant: item, selectedItem });
  };

  const hasItems = item.suggestions.some((suggestion) => suggestion.items.length > 0);

  return (
    <View className="flex">
      <Text className="text-lg font-semibold ml-6">Đề xuất</Text>
      <ScrollView>
        {!hasItems ? (
          <View style={{ flex: 1, backgroundColor: "#FFFFFF", padding: 15 }}>
            <Text></Text>
            <Text className="font-bold text-2xl mb-4">{`Thông tin đặt chỗ nhà hàng ${item.name}`}</Text>
            <Text className="mt-2" style={styles.header}>I. Đặt chỗ PasGo : Tư vấn - Giữ chỗ</Text>
            <View style={styles.contentContainer}>
              <Text className="mt-4 text-lg">
                - Quý khách vui lòng đặt chỗ trước ít nhất <Text className="font-bold">60 phút</Text> để được phục vụ tốt nhất.
              </Text>
              <Text className="mt-4 text-lg">
                - Bàn đặt của Quý khách được giữ tối đa <Text className="font-bold">15 phút</Text>
              </Text>
            </View>
            <Text className="mt-4" style={styles.header}>II. Ưu đãi tặng kèm: Chương trình ưu đãi đang được xây dựng</Text>
            <Text className="mt-2" style={styles.header}>III. Lưu ý</Text>
            <View style={styles.contentContainer}>
              <Text className="mt-4 text-lg">- Giá menu chưa bao gồm VAT. Nhà hàng luôn thu VAT theo Quy định hiện hành</Text>
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
        <View className="bg-[#E0E0E0] w-full h-3"></View>
      </ScrollView>
    </View>
  );
};

const SecondRoute: React.FC<RouteProps> = ({ item }) => (
  <ScrollView>
    <View style={{ flex: 1, backgroundColor: "#ffffff", padding: 15 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {item.imagePrice.map((menuImage, index) => (
          <View key={index} style={{ width: "50%", padding: 5 }}>
            <Image source={{ uri: menuImage.image }} style={{ width: "100%", height: 120, marginBottom: 10 }} />
          </View>
        ))}
      </View>
    </View>
    <View className="bg-[#E0E0E0] w-full h-3"></View>
  </ScrollView>
);

const ThirdRoute: React.FC<RouteProps> = () => {
  const images = [
    { uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4" },
    { uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34" },
    { uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111" },
  ];
  const [visible, setIsVisible] = useState(false);

  return (
    <ScrollView>
      <View style={{ flex: 1, backgroundColor: "#ffffff", padding: 15 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <ImageView images={images} imageIndex={0} visible={visible} onRequestClose={() => setIsVisible(false)} />
        </View>
      </View>
      <View className="bg-[#E0E0E0] w-full h-3"></View>
    </ScrollView>
  );
};

const FourRoute: React.FC<RouteProps> = ({ item }) => {
  const { coordinates } = item.location;
  return (
    <View>
      <View style={{ flex: 1, backgroundColor: "#fafafa", padding: 15 }}>
        <Text className="text-lg font-semibold ml-2 mb-5">Chỉ đường</Text>
        <View className="flex flex-row justify-center items-center space-x-2">
          <Octicons name="location" size={24} color="black" />
          <Text className="text-base text-slate-600">{item.address}</Text>
        </View>
        <Text>({"Nhấn vào ảnh bản đồ để xem chỉ đường"})</Text>
        <View className="mt-4 p-4">
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
      <View className="bg-[#E0E0E0] w-full h-3"></View>
    </View>
  );
};

const FifthRoute: React.FC<RouteProps> = ({ item }) => (
  <View className="">
    <View className="ml-4 mb-5">
      <Text className="text-lg font-bold">Giờ hoạt động</Text>
      {/* <Text>{item.openingHours}</Text> */}
      <View className="flex flex-row justify-between mt-4">
        <View className="space-y-2">
          <Text className="text-base font-semibold text-[#232323]">
            Chủ nhật
          </Text>
          <Text className="text-base font-semibold text-[#232323]">Thứ 2</Text>
          <Text className="text-base font-semibold text-[#232323]">Thứ 3</Text>
          <Text className="text-base font-semibold text-[#232323]">Thứ 4</Text>
          <Text className="text-base font-semibold text-[#232323]">Thứ 5</Text>
          <Text className="text-base font-semibold text-[#232323]">Thứ 6</Text>
          <Text className="text-base font-semibold text-[#232323]">Thứ 7</Text>
        </View>
        <View className="mr-4 space-y-2 mt-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <Text className="text-base" key={index}>
              {item.openingHours}
            </Text>
          ))}
        </View>
      </View>
    </View>
    <View className="bg-[#E0E0E0] w-full h-3"></View>
  </View>
);
const SixthRoute: React.FC<RouteProps> = ({ item }) => {
  const tags = [
    "Món Âu",
    "Hải sản",
    "Buffet",
    "Sang trọng",
    "Quận 2",
    "Gợi ý cho bạn",
    "Sắp xếp gợi ý",
    "Mức giá 250K - 500K",
  ];
  return (
    <View className="mb-[200]">
      <View className="p-4">
        <Text className="text-lg font-bold">
          Giới thiệu nhà hàng {item.name}
        </Text>
        <Text className="text-[#222222] mt-2 text-base">
          {item.description}
        </Text>
      </View>
      <View className="bg-[#E0E0E0] w-full h-3"></View>
      <View className="p-4">
        <Text className="text-2xl font-bold relative">TAGS :</Text>
        <View className="absolute w-16 h-[6] bottom-3 left-4 bg-[#E63837]"></View>
      </View>
      <View className="p-4">
        <View className="flex flex-row flex-wrap">
          {tags.map((tag, index) => (
            <View
              key={index}
              className="bg-[#F2F2F2] p-2 m-1 rounded-lg"
              style={styles.shadow}
            >
              <Text className="text-lg font-semibold">{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="bg-[#E0E0E0] w-full h-3"></View>
    </View>
  );
};

const renderScene = (props: { route: { key: string }; item: any }) => {
  const { route } = props;
  switch (route.key) {
    case "first":
      return <FirstRoute {...props} />;
    case "second":
      return <SecondRoute {...props} />;
    case "third":
      return <ThirdRoute {...props} />;
    case "four":
      return <FourRoute {...props} />;
    case "fifth":
      return <FifthRoute {...props} />;
    case "sixth":
      return <SixthRoute {...props} />;
    default:
      return null;
  }
};

interface MenuTabProps {
  item: Item;
}

const MenuTab: React.FC<MenuTabProps> = ({ item }) => {
  const [index, setIndex] = useState(0);
  const routes = [
    { key: "first", title: "Ưu đãi" },
    { key: "second", title: "Bảng giá" },
    { key: "third", title: "Ảnh" },
    { key: "four", title: "Chỉ đường" },
    { key: "fifth", title: "Giờ hoạt động" },
    { key: "sixth", title: "Chi tiết" },
  ];

  const sections = routes.map((route) => ({
    title: route.title,
    key: route.key,
    data: [item],
  }));

  return (
    <TabbedHeaderList
      backgroundColor={Colors.white}
      titleStyle={screenStyles.text}
      parallaxHeight={0}
      foregroundImage={{ uri: item.image }}
      tabs={routes.map(({ title }) => ({ title }))}
      tabTextStyle={screenStyles.text}
      sections={sections}
      tabTextContainerActiveStyle={{ backgroundColor: Colors.activeOrange }}
      tabTextActiveStyle={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}
      renderItem={({ item, section }) => renderScene({ route: section, item })}
      showsVerticalScrollIndicator={false}
      headerHeight={0}
      stickyTabs
      tabsContainerHorizontalPadding={1}
    />
  );
};

export default MenuTab;

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    marginLeft: 5,
  },
  map: {
    flex: 1,
    width: "100%",
    height: 250,
  },
  shadow: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
