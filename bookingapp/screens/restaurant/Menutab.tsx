import React, { useState, useRef } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Octicons from "@expo/vector-icons/Octicons";
import Colors from "../../constants/Colors";

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

const MenuTab: React.FC<{ item: Item }> = ({ item }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Ưu đãi");

  // Create a ref for ScrollView
  const scrollViewRef = useRef<ScrollView>(null);

  // Create refs for each section
  const advSectionRef = useRef<View>(null);
  const priceSectionRef = useRef<View>(null);
  const imageSectionRef = useRef<View>(null);
  const locationSectionRef = useRef<View>(null);
  const hoursSectionRef = useRef<View>(null);
  const detailsSectionRef = useRef<View>(null);

  const   handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
    // Scroll to the appropriate section
    switch (tab) {
      case "Ưu đãi":
        advSectionRef.current?.measureLayout(
          scrollViewRef.current?.getInnerViewNode() as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          }
        );
        break;
      case "Bảng giá":
        priceSectionRef.current?.measureLayout(
          scrollViewRef.current?.getInnerViewNode() as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          }
        );
        break;
      case "Ảnh":
        imageSectionRef.current?.measureLayout(
          scrollViewRef.current?.getInnerViewNode() as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          }
        );
        break;
      case "Chỉ đường":
        locationSectionRef.current?.measureLayout(
          scrollViewRef.current?.getInnerViewNode() as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          }
        );
        break;
      case "Giờ hoạt động":
        hoursSectionRef.current?.measureLayout(
          scrollViewRef.current?.getInnerViewNode() as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          }
        );
        break;
      case "Chi tiết":
        detailsSectionRef.current?.measureLayout(
          scrollViewRef.current?.getInnerViewNode() as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          }
        );
        break;
      default:
        break;
    }
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
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        {/* First Section: Ưu đãi */}
        <View ref={advSectionRef} style={[styles.section, styles.advSection]}>
          <Text style={styles.sectionTitle}>Ưu đãi</Text>
          <Text>{item.description}</Text>
        </View>

        {/* Second Section: Bảng giá */}
        <View ref={priceSectionRef} style={[styles.section, styles.priceSection]}>
          <Text style={styles.sectionTitle}>Bảng giá</Text>
          {item.imagePrice.map((menuImage, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri: menuImage.image }} style={styles.image} />
            </View>
          ))}
        </View>

        {/* Third Section: Ảnh */}
        <View ref={imageSectionRef} style={[styles.section, styles.imageSection]}>
          <Text style={styles.sectionTitle}>Ảnh</Text>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>

        {/* Fourth Section: Chỉ đường */}
        <View ref={locationSectionRef} style={[styles.section, styles.locationSection]}>
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
        <View ref={hoursSectionRef} style={[styles.section, styles.hoursSection]}>
          <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
          <Text>{item.openingHours}</Text>
        </View>

        {/* Sixth Section: Chi tiết */}
        <View ref={detailsSectionRef} style={[styles.section, styles.detailsSection]}>
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
    paddingVertical: 5,
    flexWrap: "wrap",
    paddingHorizontal: 3,
    marginTop: 10,
  },
  tab: {
    width: 58,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 25,
    backgroundColor: '#ff6b81',
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  selectedTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  scrollView: {
    paddingTop: 1,
  },
  section: {
    padding: 10,
    marginVertical: 10,
    backgroundColor:'#f1f2f6'
  },
  advSection: {
    backgroundColor: "#f1f2f6",
  },
  priceSection: {
    backgroundColor: "#f1f2f6",
  },
  imageSection: {
    backgroundColor: "#f1f2f6",
  },
  locationSection: {
    backgroundColor: "#f1f2f6",
  },
  hoursSection: {
    backgroundColor: "#f1f2f6",
  },
  detailsSection: {
    backgroundColor: "#f1f2f6",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color:'#2f3542'
  },
  imageItem: {
    backgroundColor:"#f1f2f6",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
    backgroundColor:"#f1f2f6"
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f1f2f6"
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
  mapWrapper: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});

export default MenuTab;
