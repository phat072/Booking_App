import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import RestaurantUI from "./ResHorUI";
import { Text } from "react-native";

type Restaurant = {
  _id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
};

type RouteParams = {
  selectedCategory?: string;
  selectedCategoryName?: string;
  searchKeyword?: string;
};

type Props = {
  route: {
    params?: RouteParams;
  };
};

const ResHor: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const [restaurantData, setRestaurantData] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { selectedCategory, selectedCategoryName, searchKeyword } = route.params || {};

        if (selectedCategory) {
          const response = await fetch(`${API_URL}/restaurants/categories/${selectedCategory}`);
          const data = await response.json();
          if (data.length) {
            setRestaurantData(data);
            navigation.setOptions({
              headerTitle: `Kết quả: ${selectedCategoryName} (${data.length})`,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchData();
  }, [route.params, navigation]);

  return <RestaurantUI restaurantData={restaurantData || []} />;
};

export default ResHor;
