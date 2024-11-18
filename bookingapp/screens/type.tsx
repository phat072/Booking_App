import { StackNavigationProp } from "@react-navigation/stack";

export type HomeAdminRootStackParamList = {
    HomeAdmin: undefined;
    OrderTab: undefined;
};

export type HomeAdminNavigationProp = StackNavigationProp<HomeAdminRootStackParamList, "HomeAdmin">;

export type OrdersStackParamList = {
    Home: undefined;
    Orders: undefined;
    Dashboard: undefined;
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

  export type AccountStackParamList ={
    Account: undefined;
    EditAccount: undefined;
    ChangePassword : undefined;
    HistoryOrder : undefined;
    Favourite : undefined;
    Chat : undefined;
    BottomSheet : undefined;
    Privacy : undefined;
    Login : undefined;
  }


  export type CityStackParamList = {
    City: {
      selectedCity: string | null;
      // setSelectedCity: (city: string | null) => void;r
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
    City: {
      selectedCity: string | null;
      // setSelectedCity: (city: string | null) => void;
    };
    HomeScreen: { selectedCity: string | null };
  };
  