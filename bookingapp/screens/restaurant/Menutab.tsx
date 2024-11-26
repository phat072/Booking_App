import React, { useState, useEffect, useRef } from "react";
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
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Callout } from "react-native-maps";
import Octicons from "@expo/vector-icons/Octicons";
import Colors from "../../constants/Colors";
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

const MenuTab: React.FC<{ item: Item }> = ({ item }) => {
  const [selectedTab, setSelectedTab] = useState<string>("first");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
    if (scrollViewRef.current) {
      const offsetY = getSectionOffset(tab);
      scrollViewRef.current.scrollTo({ y: offsetY, animated: true });
    }
  };

  const getSectionOffset = (section: string) => {
    switch (section) {
      case "Ưu đãi": return 0;
      case "Bảng giá": return 250;
      case "Ảnh": return 1700;
      case "Chỉ đường": return 2100;
      case "Giờ hoạt động": return 2300;
      case "Chi tiết": return 2500;
      default: return 0;
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    let activeTab = "first";
    if (contentOffsetY >= 250 && contentOffsetY < 1700) activeTab = "Bảng giá";
    else if (contentOffsetY >= 1700 && contentOffsetY < 2100) activeTab = "Ảnh";
    else if (contentOffsetY >= 2100 && contentOffsetY < 2300) activeTab = "Chỉ đường";
    else if (contentOffsetY >= 2300 && contentOffsetY < 2500) activeTab = "Giờ hoạt động";
    else if (contentOffsetY >= 2500) activeTab = "Chi tiết";
    setSelectedTab(activeTab);
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, selectedTab === "Ưu đãi" && styles.selectedTab]}
          onPress={() => handleTabSelect("Ưu đãi")}
        >
          <Text style={styles.tabText}>Ưu đãi</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === "Bảng giá" && styles.selectedTab]}
          onPress={() => handleTabSelect("Bảng giá")}
        >
          <Text style={styles.tabText}>Bảng giá</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === "Ảnh" && styles.selectedTab]}
          onPress={() => handleTabSelect("Ảnh")}
        >
          <Text style={styles.tabText}>Ảnh</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === "Chỉ đường" && styles.selectedTab]}
          onPress={() => handleTabSelect("Chỉ đường")}
        >
          <Text style={styles.tabText}>Chỉ đường</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === "Giờ hoạt động" && styles.selectedTab]}
          onPress={() => handleTabSelect("Giờ hoạt động")}
        >
          <Text style={styles.tabText}>Giờ hoạt động</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === "Chi tiết" && styles.selectedTab]}
          onPress={() => handleTabSelect("Chi tiết")}
        >
          <Text style={styles.tabText}>Chi tiết</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16} // To optimize scroll event handling
      >
        {/* First Section: Ưu đãi */}
        <View style={[styles.section, styles.advSection]} id="first">
          <Text style={styles.sectionTitle}>Ưu đãi</Text>
          <Text>{item.description}</Text>
        </View>

        {/* Second Section: Bảng giá */}
        <View style={[styles.section, styles.priceSection]} id="second">
          <Text style={styles.sectionTitle}>Bảng giá</Text>
          {item.imagePrice.map((menuImage, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri: menuImage.image }} style={styles.image} />
            </View>
          ))}
        </View>

        {/* Third Section: Ảnh */}
        <View style={[styles.section, styles.imageSection]} id="third">
          <Text style={styles.sectionTitle}>Ảnh</Text>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>

        {/* Fourth Section: Chỉ đường */}
        <View style={[styles.section, styles.locationSection]} id="four">
          <Text style={styles.sectionTitle}>Chỉ đường</Text>
          <View style={styles.locationRow}>
            <Octicons name="location" size={24} color="black" />
            <Text style={styles.locationText}>{item.address}</Text>
          </View>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: item.location.coordinates[1],
                longitude: item.location.coordinates[0],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: item.location.coordinates[1],
                  longitude: item.location.coordinates[0],
                }}
              >
                <Callout>
                  <Text>{item.name}</Text>
                </Callout>
              </Marker>
            </MapView>
          </View>
        </View>

        {/* Fifth Section: Giờ hoạt động */}
        <View style={[styles.section, styles.hoursSection]} id="fifth">
          <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
          <Text>{item.openingHours}</Text>
        </View>

        {/* Sixth Section: Chi tiết */}
        <View style={[styles.section, styles.detailsSection]} id="sixth">
          <Text style={styles.sectionTitle}>Chi tiết</Text>
          <Text>{item.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 15,
    flexWrap: "wrap", // Allow wrapping if tabs are too wide
    paddingHorizontal:3,
  },
  tab: {
    width: 58, // Set a fixed width for each button
    height: 40, // Set a fixed height for each button
    justifyContent: "center", // Center the text inside the button
    alignItems: "center", // Align text horizontally
    margin: 3, // Space between the buttons
    borderRadius: 25, // This makes the button circular
    backgroundColor: Colors.primary, // No background by default
    borderWidth: 2, // Border width to create a border
    borderColor: "#fff", // White border color (you can customize this)
  },
  selectedTab: {
    backgroundColor: Colors.secondary, // Background color when selected
  },
  tabText: {
    color: "#fff", // White text color
    fontWeight: "bold", // Bold text
    fontSize: 12, // Font size for the tab text
    textAlign: "center", // Center the text horizontally
  },
  scrollView: {
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 20,
    backgroundColor: "#f8f8f8", // General background for all sections
    borderRadius: 8, // Rounded corners for sections
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  advSection: {
    backgroundColor: "#e6f7ff", // Light blue for Ưu đãi
  },
  priceSection: {
    backgroundColor: "#fff3e6", // Light orange for Bảng giá
  },
  imageSection: {
    backgroundColor: "#f9f9f9", // Light gray for Ảnh
  },
  locationSection: {
    backgroundColor: "#e6f2ff", // Light blue for Chỉ đường
  },
  hoursSection: {
    backgroundColor: "#fff0f0", // Light pink for Giờ hoạt động
  },
  detailsSection: {
    backgroundColor: "#f4f4f4", // Light gray for Chi tiết
  },
  imageItem: {
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  mapWrapper: {
    height: 260,
    marginVertical: 25,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
});

export default MenuTab;
