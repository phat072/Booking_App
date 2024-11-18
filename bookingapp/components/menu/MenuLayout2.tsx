import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";

interface MenuItem {
  image: string;
  title: string;
  subTitle: string;
  originalPrice: string;
  highLight: string;
}

interface MenuSuggestion {
  title: string;
  items: MenuItem[];
}

interface MenuLayout2Props {
  restaurant: {
    suggestions: MenuSuggestion[];
  };
}

const MenuLayout2: React.FC<MenuLayout2Props> = ({ restaurant }) => {
  const onItemSelect = (item: MenuItem) => {
    console.log("Item selected:", item);
    // Add logic for item selection here
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      {restaurant.suggestions.map((suggestion, index) => (
        <View key={index} style={styles.suggestionContainer}>
          <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
          <ScrollView>
            {suggestion.items.map((item, idx) => (
              <View key={idx} style={styles.itemContainer}>
                <View style={styles.itemRow}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.itemImage}
                      source={{ uri: item.image }}
                    />
                    <TouchableOpacity style={styles.bestsellerButton}>
                      <Text style={styles.bestsellerText}>bán chạy</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubTitle}>{item.subTitle}</Text>
                    <Text style={styles.itemPrice}>{item.originalPrice}</Text>
                    <Text style={styles.itemHighlight}>{item.highLight}</Text>
                    <Text style={styles.rulesText}>
                      Quy định & điều kiện sử dụng sản phẩm này
                    </Text>
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => onItemSelect(item)}
                    >
                      <Text style={styles.selectButtonText}>Select now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};

export default MenuLayout2;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 8,
  } as ViewStyle,
  suggestionContainer: {
    marginBottom: 16,
  } as ViewStyle,
  suggestionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  } as TextStyle,
  itemContainer: {
    marginBottom: 16,
  } as ViewStyle,
  itemRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#B7B7B7",
    paddingBottom: 16,
    marginBottom: 16,
  } as ViewStyle,
  imageContainer: {
    marginRight: 8,
  } as ViewStyle,
  itemImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
  } as ImageStyle,
  bestsellerButton: {
    marginTop: 8,
    alignSelf: "center",
    borderColor: "#BF3431",
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  } as ViewStyle,
  bestsellerText: {
    color: "#BF3431",
    fontSize: 12,
    textAlign: "center",
  } as TextStyle,
  itemDetails: {
    flex: 1,
  } as ViewStyle,
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  } as TextStyle,
  itemSubTitle: {
    fontSize: 14,
    color: "#6c6c6c",
    marginBottom: 4,
  } as TextStyle,
  itemPrice: {
    fontSize: 16,
    color: "#E15241",
    marginBottom: 4,
  } as TextStyle,
  itemHighlight: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  } as TextStyle,
  rulesText: {
    fontSize: 12,
    color: "#337ab7",
    textDecorationLine: "underline",
    marginBottom: 8,
  } as TextStyle,
  selectButton: {
    borderWidth: 1,
    borderColor: "#9A9A9A",
    borderRadius: 4,
    paddingVertical: 4,
  } as ViewStyle,
  selectButtonText: {
    textAlign: "center",
    color: "#313131",
  } as TextStyle,
});
