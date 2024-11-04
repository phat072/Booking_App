import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
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
  RootStackParamList,
  "FeatureScreen"
>;

type FeatureScreenRouteProp = RouteProp<RootStackParamList, "FeatureScreen">;
