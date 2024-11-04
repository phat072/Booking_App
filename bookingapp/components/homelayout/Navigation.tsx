import { NavigationProp } from '@react-navigation/native';

// Define your stack parameter list
export type RootStackParamList = {
  Result: {
    selectedCategory: string;
    selectedCategoryName: string;
  };
  // Add other screens here if necessary
};

// Extend the navigation prop with your types
export type AppNavigationProp = NavigationProp<RootStackParamList>;
