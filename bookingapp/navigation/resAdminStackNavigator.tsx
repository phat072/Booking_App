import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ResAdmin from "../screens/admin/ResAdmin";
import AddRes from "../screens/admin/AddRes";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Chỉnh sửa ở đây
import ResInfo from "../screens/admin/ResInfo";

export type ResStackParamList = {
  ResAdmin: undefined;
  AddRes: undefined;
  ResInfo: { id: string };
  Dashboard: undefined; // Thêm dòng này
};

const Stack = createNativeStackNavigator<ResStackParamList>();

const ResAdminStackNavigator = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ResStackParamList>>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ResAdmin"
        component={ResAdmin}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Manage",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#1C212D" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Dashboard");
              }}
            >
              <View
                style={{
                  marginLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons name="chevron-back" size={35} color="#34DBA1" />
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="AddRes"
        component={AddRes}
        options={{
          headerStyle: { backgroundColor: "#1C212D" },
          headerTitleAlign: "center",
          headerTitle: "Thêm nhà hàng",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="ResInfo"
        component={ResInfo}
        options={{
          headerStyle: { backgroundColor: "#1C212D" },
          headerTitleAlign: "center",
          headerTitle: "Thông tin nhà hàng",
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};

export default ResAdminStackNavigator;
