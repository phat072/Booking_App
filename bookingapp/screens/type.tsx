import { StackNavigationProp } from "@react-navigation/stack";

export type HomeAdminRootStackParamList = {
    HomeAdmin: undefined;
    OrderTab: undefined;
    Restaurants : undefined;
    Customers : undefined;
    Category : undefined;
};

export type HomeAdminNavigationProp = StackNavigationProp<AccountStackParamList, "HomeAdmin">;

export type ChatRootStackParamList = {
  ChatScreen: undefined;
  Login: undefined;
  People: undefined;
  AccountTab: undefined;
};

export type ChatNavigationProp = StackNavigationProp<ChatRootStackParamList, "ChatScreen">;

export type OrdersStackParamList = {
    Home: undefined;
    Orders: undefined;
    Dashboard: undefined;
    RestaurantDetail: { item: any }; // Thay `any` bằng kiểu dữ liệu chính xác của nhà hàng nếu có
    SearchScreen: undefined; // Định nghĩa các màn hình khác nếu có
    DetailOrders: {
      order: {
        _id: string;
        status: string;
        restaurant: string;
        adults: number;
        children: number;
        date: string;
        selectedHour: string;
        note: string;
        user: string;
      };
      users: {
        [key: string]: {
          name: string;
          mobileNo: string;
          email: string;
        };
      };
      restaurants: {
        [key: string]: {
          name: string;
          address: string;
          image: string;
          suggestions: {
            items: {
              title: string;
              originalPrice: string;
            }[];
          }[];
        };
      };
    };
    Order: {
      restaurant: any; 
      selectedItem?: any;
    };
  };

  // Define AccountStackParamList properly
  export type AccountStackParamList = {
    Account: undefined;
    EditAccount: undefined;
    ChangePassword: undefined;
    HistoryOrder: undefined;
    Favourite: undefined;
    BottomSheet: undefined;
    Privacy: undefined;
    Login: undefined;
    Annotations: undefined;
    HomeAdmin: undefined;
    OrderTab: undefined;
    Restaurants : undefined;
    Customers : undefined;
    Category : undefined;
    Dashboard: undefined;
    Chats: undefined;
  };

  export type CityStackParamList = {
    City: {
      selectedCity: string | null;
    };
    HomeScreen: { selectedCity: string | null };
  };
  
  export type StackStackParamList = {
    Onboarding: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined;
    Privacy: undefined;
    HistoryOrder: undefined;
    EditAccount: undefined;
    Admin:undefined;
    City: {
      selectedCity: string | null;
      // setSelectedCity: (city: string | null) => void;
    };
    HomeScreen: { selectedCity: string | null };
    BottomSheet: undefined;
    Filter: undefined;
    OrderSuccess : undefined;
    BookingHours : undefined;
    ChangePassword : undefined;
    Notification : undefined;
    FoodDetail: {
      item: {
        title: string;
        subTitle: string;
        image: string;
        originalPrice: string;
        discountedPrice: string;
        discountPercentage: string;
        highLight: string;
      };
      restaurant: {
        name: string;
      };
    };
    ListMenuRes : undefined;
    Order : undefined;
    Favourite : undefined;
    Chats: undefined;
  };

export type AdminStackParamList = {
    Restaurants: {
      _id: string;
      name: string;
      address: string;
      image: string;
      rating: number;
      distance: number;
    };
    // Add other screens here if necessary
  };
  