import { StackNavigationProp } from "@react-navigation/stack";

export type HomeAdminRootStackParamList = {
    HomeAdmin: undefined;
    OrderTab: undefined;
};

export type HomeAdminNavigationProp = StackNavigationProp<HomeAdminRootStackParamList, "HomeAdmin">;

export type AdminStackParamList = {
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
  