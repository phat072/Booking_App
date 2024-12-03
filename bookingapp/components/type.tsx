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

export interface SearchBarProps {
  searchPhrase: string;
  setSearchPhrase: (phrase: string) => void;
}


export type ChatRootStackParamList = {
  ChatScreen: undefined;
  Login: undefined;
  People: undefined;
  ChatRoom: { name: string; receiverId: string; image: string }; 
  Request: { name: string; receiverId: string };
};

export type ChatNavigationProp = StackNavigationProp<ChatRootStackParamList, "ChatScreen">;
