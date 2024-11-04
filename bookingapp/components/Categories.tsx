import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import axios from "axios"; // Import axios
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";

// Define the Category interface
interface Category {
  _id: string;
  name: string;
  image: string;
}

const Categories: React.FC = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        const fetchedCategories: Category[] = response.data;
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Call the function to fetch categories when the component mounts
    fetchCategories();
  }, []); // Empty dependency array to ensure the effect runs only once when the component mounts
  console.log(categories);
  console.log(API_URL, "aa");

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories?.map((category, index) => {
          const isActive = category._id === activeCategory;
          return (
            <View key={index} style={styles.categoryContainer}>
              <TouchableOpacity
                style={[styles.categoryButton, isActive && styles.activeButton]}
                onPress={() => {
                  setActiveCategory(category._id);
                  console.log("Selected Category ID:", category._id);
                  navigation.navigate("Result", {
                    selectedCategory: category._id,
                    selectedCategoryName: category.name,
                  });
                }}
              >
                <Image
                  style={styles.categoryImage}
                  source={{ uri: category.image }}
                />
              </TouchableOpacity>
              <Text style={[styles.categoryText, isActive && styles.activeText]}>
                {category.name}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  scrollContainer: {
    paddingHorizontal: 15,
  },
  categoryContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 24,
    marginTop: 8,
  },
  categoryButton: {
    padding: 13,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    backgroundColor: "#FFFFFF", // Default background color
  },
  activeButton: {
    backgroundColor: "#FFFFFF", // Change if needed for active state
  },
  categoryImage: {
    width: 45,
    height: 45,
  },
  categoryText: {
    fontSize: 14,
    color: "#1A1A1A",
  },
  activeText: {
    fontWeight: "normal",
    marginTop: 4,
    fontSize: 16,
  },
});

export default Categories;
