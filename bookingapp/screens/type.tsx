import { StackNavigationProp } from "@react-navigation/stack";

export type HomeAdminRootStackParamList = {
    HomeAdmin: undefined;
    OrderTab: undefined;
};

export type HomeAdminNavigationProp = StackNavigationProp<HomeAdminRootStackParamList, "HomeAdmin">;