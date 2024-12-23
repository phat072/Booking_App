import AsyncStorage from "@react-native-async-storage/async-storage";
import {
ScrollView,
StyleSheet,
Text,
TouchableOpacity,
View,
Modal,
Animated,
TouchableWithoutFeedback,
} from "react-native";
import React, {
useContext,
useEffect,
useState,
useCallback,
useRef,
useMemo,
} from "react";
import { useNavigation } from "@react-navigation/native";
import HomeAdminCard from "../../components/admin/HomeAdminCard";
import { UserType } from "../../userContext";
import { API_URL } from "@env";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar } from "@rneui/themed";
import { LineChart } from "react-native-gifted-charts";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import Calendar from "../../components/admin/Calendar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { HomeAdminNavigationProp } from "../type";

interface AddressData {
address: string;
city: string;
postalCode: string;
// add any other fields returned by your API
}

interface DecodedToken {
userId: string;
exp: number;
// other properties in your token payload
}

interface SelectedWeek {
startOfWeek: any; // Replace `any` with the appropriate type if using a library like moment.js
endOfWeek: any;
}

// Custom Bottom Sheet Component
const CustomBottomSheet: React.FC<{
visible: boolean;
onClose: () => void;
children: React.ReactNode;
}> = ({ visible, onClose, children }) => {
const slideAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
    if (visible) {
    Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
    }).start();
    } else {
    Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    }).start();
    }
}, [visible]);

const slideStyle = {
    transform: [
    {
        translateY: slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
        }),
    },
    ],
};

if (!visible) return null;

return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop} />
    </TouchableWithoutFeedback>
    <Animated.View style={[styles.bottomSheetContainer, slideStyle]}>
        {children}
    </Animated.View>
    </Modal>
);
};

const HomeAdmin: React.FC = () => {
const { userId, setUserId, user, updateUser } = useContext(UserType);
const [address, setAddress] = useState<AddressData[]>([]);
const navigation = useNavigation<HomeAdminNavigationProp>();
const [selectedWeek, setSelectedWeek] = useState<SelectedWeek | null>(null);
const [resetTrigger, setResetTrigger] = useState(false);
const [isSheetVisible, setSheetVisible] = useState(false);
const [totalOrder, setTotalOrder] = useState(0);    

const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      if (response.ok) {
        setTotalOrder(data.orders.length);
      }
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

useEffect(() => {
    fetchOrders();
}, []); 
const fetchAddress = useCallback(async () => {
    try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Token not found");
    const decodedToken = jwt_decode(token) as DecodedToken;
    setUserId(decodedToken.userId);
    await fetchAddressData(decodedToken.userId);
    } catch (error) {
    console.log("Error fetching address", error);
    }
}, [setUserId]);

const fetchAddressData = async (userId: string) => {
    try {
    const response = await axios.get<AddressData[]>(`${API_URL}/address/${userId}`);
    const addressData = response.data;
    updateUser(addressData);
    // console.log(addressData, "user fetch");
    } catch (error) {
    // console.log(`${API_URL}/address/${userId}`);
    // console.log("Error fetching address data", error);
    }
};

useEffect(() => {
    fetchAddress();
}, [fetchAddress]);

const lineData = [
    { value: 5, dataPointText: "5" },
    { value: 12, dataPointText: "12" },
    { value: 45, dataPointText: "45" },
    { value: 35, dataPointText: "35" },
    { value: 62, dataPointText: "62" },
    { value: 90, dataPointText: "90" },
    { value: 100, dataPointText: "100" },
];

const lineData2 = [
    { value: 20, dataPointText: "20" },
    { value: 35, dataPointText: "35" },
    { value: 70, dataPointText: "70" },
    { value: 12, dataPointText: "12" },
    { value: 37, dataPointText: "37" },
    { value: 55, dataPointText: "55" },
    { value: 90, dataPointText: "90" },
];

const handleClearFilter = () => {
    setSelectedWeek(null);
};

const formatSelectedWeek = () => {
    if (!selectedWeek) return "Tuần này";
    const { startOfWeek, endOfWeek } = selectedWeek;
    const weekNumber = startOfWeek.week();
    return `Tuần ${weekNumber}, ${startOfWeek.format("DD/MM")} - ${endOfWeek.format("DD/MM")}`;
};

const resetSelectedWeek = () => {
    setResetTrigger(true);
    setTimeout(() => setResetTrigger(false), 100);
};

return (
    <ScrollView>
    <View style={{ flex: 1 }}>
        <LinearGradient
        colors={["#ffffff", "#fff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
        >
        <View style={styles.header}>
            <View>
            <Text style={styles.greetingText}>Hello {user?.name}</Text>
            <Entypo name="hand" size={24} color="#FFE3C6" />
            <Text style={styles.subtitleText}>Welcome to Dashboard</Text>
            </View>
            <Avatar size={70} rounded source={{ uri: user?.avatar }} />
        </View>

        <View style={styles.cardContainer}>
            <View style={styles.row}>
            <TouchableOpacity
                onPress={() => {
                if (selectedWeek) {
                    handleClearFilter();
                    resetSelectedWeek();
                } else {
                    setSheetVisible(true);
                }
                }}
                style={styles.filterButton}
            >
                {selectedWeek ? (
                <>
                    <Ionicons name="calendar-outline" size={24} color="black" />
                    <Text style={styles.filterText}>{formatSelectedWeek()}</Text>
                    <AntDesign name="closecircle" size={18} color="black" />
                </>
                ) : (
                <Text style={styles.filterText}>Tuần này</Text>
                )}
            </TouchableOpacity>
            <View style={styles.totalOrderContainer}>
                <Text style={styles.totalOrderText}>Total Order</Text>
                <View style={styles.totalOrderValueContainer}>
                <Text style={styles.totalOrderValue}>{totalOrder}</Text>
                <Ionicons name="restaurant-sharp" size={20} color="#0B36A6" />
                </View>
            </View>
            </View>
            <LineChart
            data={lineData}
            data2={lineData2}
            height={300}
            width={320}
            thickness={1}
              hideRules={true}
              spacing={47}
              color="#42a5f5"
              color2="#ff0000"
              showScrollIndicator={true}
              areaChart={false}
              startFillColor="transparent"
              endFillColor="transparent"
              noOfSections={5}
              maxValue={150}
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisTextStyle={{ color: "grey", fontSize: 12 }}
              xAxisLabelTexts={[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ]}
              onPress={(item: { value: any }, index: number) => {
                alert(`Value: ${item.value}`);
              }}
              initialSpacing={20}
            />
        </View>
        <View style={styles.cardsWrapper}>
            <HomeAdminCard
            title="Analytics"
            iconUri="https://cdn-icons-png.flaticon.com/512/5145/5145848.png"
            borderColor="#F9D860"
            bgColor="#FEF7DC"
            onPress={() => navigation.navigate("HomeAdmin")}
            />
            <HomeAdminCard
              title="Restaurants"
              iconUri="https://cdn-icons-png.flaticon.com/512/9638/9638472.png"
              borderColor="#6FB168"
              bgColor="#E4F0E3"
              onPress={() => navigation.navigate("Restaurants")}
            />
            <HomeAdminCard
              title="Customers"
              iconUri="https://cdn2.iconfinder.com/data/icons/user-23/512/User_Customers.png"
              borderColor="#FF8D09"
              bgColor="#FFE9CF"
              onPress={() => navigation.navigate("Customers")}
            />
            <HomeAdminCard
              title="Category"
              iconUri="https://cdn-icons-png.freepik.com/256/9710/9710991.png?semt=ais_hybrid"
              borderColor="#7277FC"
              bgColor="#E1E2FE"
              onPress={() => navigation.navigate("Category")}
            />

             <HomeAdminCard
              title="Orders"
              iconUri="https://cdn-icons-png.freepik.com/256/3045/3045670.png?semt=ais_hybrid"
              borderColor="#E091D7"
              bgColor="#F9EAF7"
              onPress={() => navigation.navigate("OrderTab")}
            />
            
        </View>
        </LinearGradient>
    </View>

    <CustomBottomSheet visible={isSheetVisible} onClose={() => setSheetVisible(false)}>
        <Calendar setSelectedWeek={setSelectedWeek} resetTrigger={resetTrigger} handleClosePress={function (): void {
                throw new Error("Function not implemented.");
            } } />
    </CustomBottomSheet>
    </ScrollView>
);
};

export default HomeAdmin;

const styles = StyleSheet.create({
header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    paddingTop: 0,
},
greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
},
subtitleText: {
    color: "grey",
},
cardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
},
row: {
    flexDirection: "row",
    alignItems: "center",
},
filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 10,
},
filterText: {
    fontSize: 16,
    color: "black",
    marginLeft: 8,
},
totalOrderContainer: {
    flex: 1,
    alignItems: "flex-end",
},
totalOrderText: {
    fontSize: 16,
    color: "black",
},
totalOrderValueContainer: {
    flexDirection: "row",
    alignItems: "center",
},
totalOrderValue: {
    fontSize: 24,
    color: "#0B36A6",
    marginRight: 8,
},
modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
},
bottomSheetContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
},
cardsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
},
});