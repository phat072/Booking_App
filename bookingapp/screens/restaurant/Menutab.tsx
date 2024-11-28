import React, { useState, useRef } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Octicons from "@expo/vector-icons/Octicons";
import Colors from "@/constants/Colors";
interface Item {
  description: string;
  image: string;
  address: string;
  openingHours: string;
  name: string;
  imagePrice: Array<{ image: string }>;
  location: {
    coordinates: [number, number];
  };
}

interface MenuTabProps {
  item: Item;
}

const MenuTab: React.FC<MenuTabProps> = ({ item }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Ưu đãi");
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({}).current;

  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
    const offsetY = sectionOffsets[tab];
    if (offsetY !== undefined) {
      scrollViewRef.current?.scrollTo({ y: offsetY, animated: true });
    }
  };

  const handleLayout = (tab: string, event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    sectionOffsets[tab] = y;
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabsContainer}>
        {["Ưu đãi", "Bảng giá", "Ảnh", "Chỉ đường", "Giờ hoạt động", "Chi tiết"].map(
          (tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.selectedTab]}
              onPress={() => handleTabSelect(tab)}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </Pressable>
          )
        )}
      </View>

      {/* Content */}
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <View
          onLayout={(event) => handleLayout("Ưu đãi", event)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Ưu đãi</Text>
          <Text>{item.description}</Text>
        </View>

        <View
          onLayout={(event) => handleLayout("Bảng giá", event)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Bảng giá</Text>
          {item.imagePrice.map((menuImage, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri: menuImage.image }} style={styles.image} />
            </View>
          ))}
        </View>

        <View
          onLayout={(event) => handleLayout("Ảnh", event)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Ảnh</Text>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>

        <View
          onLayout={(event) => handleLayout("Chỉ đường", event)}
          style={styles.section}
        >
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

        <View
          onLayout={(event) => handleLayout("Giờ hoạt động", event)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
          <Text>{item.openingHours}</Text>
        </View>

        <View
          onLayout={(event) => handleLayout("Chi tiết", event)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Chi tiết</Text>
          <Text>{item.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", 
    padding: 10,
  },
  tab: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  selectedTab: { backgroundColor: "#A23333" },
  tabText: { color: "#000" },
  scrollView: { flex: 1 },
  section: { padding: 20, backgroundColor: "#f1f1f1", marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  image: { width: "100%", height: 200 },
  locationRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  locationText: { marginLeft: 10 },
  mapWrapper: { height: 200 },
  map: { flex: 1 },
  imageItem: {
    backgroundColor:"#f1f2f6",
    marginBottom: 10,
  },
});

export default MenuTab;
