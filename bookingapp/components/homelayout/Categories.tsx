import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from './Navigation'; // Adjust the import path as necessary

interface Category {
  _id: string;
  name: string;
  image: string;
}

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const navigation = useNavigation<AppNavigationProp>(); // Type the navigation prop
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <View style={{ marginTop: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
      >
        {categories?.map((category, index) => {
          const isActive = category._id === activeCategory;

          return (
            <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 24, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  setActiveCategory(category._id);
                  navigation.navigate("Result", {
                    selectedCategory: category._id,
                    selectedCategoryName: category.name,
                  });
                }}
                style={[{
                  padding: 13,
                  borderRadius: 100,
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 3,
                    height: 3,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 8,
                }, isActive ? { backgroundColor: '#FFFFFF' } : { backgroundColor: '#FFFFFF' }]}
              >
                <Image
                  style={{ width: 45, height: 45 }}
                  source={{ uri: category.image }}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: 14, color: isActive ? '#1A1A1A' : '#1A1A1A', marginTop: isActive ? 16 : 0 }}>{category.name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Categories;
