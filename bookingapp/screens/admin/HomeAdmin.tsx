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
    import { StackNavigationProp } from "@react-navigation/stack";
    import { RootStackParamList } from "./HomeAdminNavigationProps";
    // Define types for navigation and API response data
    type HomeAdminNavigationProp = StackNavigationProp<RootStackParamList, "HomeAdmin">;

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
    const [error, setError] = useState<string | null>(null);
    const [selectedWeek, setSelectedWeek] = useState<SelectedWeek | null>(null);
    const [resetTrigger, setResetTrigger] = useState(false);
    const [isSheetVisible, setSheetVisible] = useState(false);

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
        console.log(addressData, "user fetch");
        } catch (error) {
        console.log(`${API_URL}/address/${userId}`);
        console.log("Error fetching address data", error);
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
                    <Text style={styles.totalOrderValue}>5</Text>
                    <Ionicons name="restaurant-sharp" size={20} color="#0B36A6" />
                    </View>
                </View>
                </View>
                <LineChart
                data={lineData}
                data2={lineData2}
                height={300}
                width={320}
                // Chart configuration...
                />
            </View>
            <View style={styles.cardsWrapper}>
                <HomeAdminCard
                title="Analytics"
                iconUri="https://res.cloudinary.com/dc5xcbmvp/image/upload/v1719304124/icons8-chart-100_bptvcu.png"
                borderColor="#F9D860"
                bgColor="#FEF7DC"
                onPress={() => navigation.navigate("OrderTab")}
                />
                {/* Add other cards similarly */}
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
        paddingTop: 50,
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
