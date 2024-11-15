import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type FeatureRootStackParamList = {
  FeatureScreen: {
    title: string;
    subTitle: string;
    restaurants: {
      id: number;
      name: string;
      image: string;
      rating: number;
      address: string;
    }[];
    layout: number;
  };
};

export type FeatureScreenNavigationProp = StackNavigationProp<
FeatureRootStackParamList,
  "FeatureScreen"
>;

type FeatureScreenRouteProp = RouteProp<FeatureRootStackParamList, "FeatureScreen">;

type RestaurantRootStackParamList= {
  RestaurantDetail: {
    _id: string;
    name: string;
    address: string;
    image?: string;
    rating: number;
  }[];
};

export type RestaurantDetailRouteProp = RouteProp<RestaurantRootStackParamList, "RestaurantDetail">;
