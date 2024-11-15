import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import {
  FontAwesome5,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "@env";
import { UserType } from "@/userContext";
import { Button, Dialog, Portal } from "react-native-paper";
import moment from "moment";

import { NavigationProp } from "@react-navigation/native";

const OrderScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const route = useRoute<{ key: string; name: string; params: { restaurant: any; selectedItem: any } }>();
  const { restaurant, selectedItem } = route.params;
  const { user } = useContext(UserType);

  const [adults, setAdults] = useState("0");
  const [children, setChildren] = useState("0");
  const [selectedTime, setSelectedTime] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  const bookingHours = restaurant.bookingHours;

  let closestTime: string | null = null;
  let closestTimeDiff = Infinity;

  bookingHours.forEach((bookingTime: string | null) => {
    if (bookingTime && typeof bookingTime === "string") {
      const [hour, minute] = bookingTime.split(":");
      const bookingTotalMinutes = parseInt(hour) * 60 + parseInt(minute);

      if (bookingTotalMinutes > currentTotalMinutes) {
        const timeDiff = bookingTotalMinutes - currentTotalMinutes;
        if (timeDiff < closestTimeDiff) {
          closestTimeDiff = timeDiff;
          closestTime = bookingTime;
        }
      }
    }
  });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const showDialog = (message: React.SetStateAction<string>) => {
    setErrorMessage(message);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setErrorMessage("");
  };

  const submitOrder = async () => {
    try {
      if (!selectedDate) {
        showDialog("Please select a date.");
        return;
      }
      if (!user || !restaurant) {
        showDialog("User or restaurant not found");
        return;
      }

      const orderData = {
        userId: user._id,
        restaurantId: restaurant._id,
        adults: parseInt(adults),
        children: parseInt(children),
        date: selectedDate.toISOString(),
        selectedHour: selectedTime || closestTime,
        note: orderNote,
        selectedItem,
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const responseData = await response.json();
        navigation.navigate("OrderSuccess");
      } else {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>Đặt chỗ đến</Text>
          <View style={styles.restaurantInfo}>
            <Image source={{ uri: restaurant.image }} style={styles.image} />
            <View>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.address}>{restaurant.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Thông tin đơn hàng</Text>

          <View style={styles.inputRow}>
            <FontAwesome5 name="user" size={24} style={styles.icon} />
            <Text style={styles.label}>Số người lớn:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={adults}
              onChangeText={setAdults}
            />
          </View>

          <View style={styles.inputRow}>
            <MaterialIcons name="child-care" size={24} style={styles.icon} />
            <Text style={styles.label}>Số trẻ em:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={children}
              onChangeText={setChildren}
            />
          </View>

          <View style={styles.inputRow}>
            <AntDesign name="calendar" size={24} style={styles.icon} />
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.dateText}>
                {selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : "Chọn ngày"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <AntDesign name="clockcircleo" size={24} style={styles.icon} />
            <TouchableOpacity>
              <Text style={styles.dateText}>{selectedTime || closestTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={submitOrder}>
            Submit Order
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Text>{errorMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { margin: 15 },
  title: { fontSize: 18, fontWeight: "bold" },
  subtitle: { fontSize: 16, marginBottom: 10 },
  restaurantInfo: { flexDirection: "row", marginBottom: 15 },
  image: { width: 80, height: 80, marginRight: 10 },
  restaurantName: { fontSize: 16, fontWeight: "bold" },
  address: { fontSize: 14, color: "gray" },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  icon: { marginRight: 10 },
  label: { fontSize: 16, flex: 1 },
  input: { flex: 2, borderBottomWidth: 1, borderColor: "#ccc", padding: 5, fontSize: 16 },
  dateText: { fontSize: 16 },
  buttonContainer: { paddingHorizontal: 15, marginTop: 20 },
});

export default OrderScreen;