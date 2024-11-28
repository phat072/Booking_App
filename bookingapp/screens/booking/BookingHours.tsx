import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import PopUp from "@/components/menu/Popup";
import { useRoute, RouteProp, useNavigation, NavigationProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface BookingHoursProps {
  restaurant: {
    bookingHours: string[];
  };
  selectedDate: Date;
  bookingHours: string[];
  closestTime: string;
  onTimeChange: (time: string) => void;
}

const BookingHours: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<Record<string, BookingHoursProps>, string>>();
  const {
    restaurant,
    selectedDate,
    closestTime,
    onTimeChange,
  } = route.params;

  const [selectedTime, setSelectedTime] = useState<string>(closestTime);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const isPastTime = (bookingTime: string): boolean => {
    const currentDate = new Date();
    const selectedDateWithoutTime = new Date(selectedDate);
    selectedDateWithoutTime.setHours(0, 0, 0, 0);
    const currentDateWithoutTime = new Date();
    currentDateWithoutTime.setHours(0, 0, 0, 0);

    if (selectedDateWithoutTime > currentDateWithoutTime) {
      return false; // selected date is in the future, so all times are valid
    }

    const [hour, minute] = bookingTime.split(":");
    const bookingTotalMinutes = parseInt(hour) * 60 + parseInt(minute);
    const currentTotalMinutes =
      currentDate.getHours() * 60 + currentDate.getMinutes();

    return bookingTotalMinutes <= currentTotalMinutes;
  };

  const handleApply = () => {
    onTimeChange(selectedTime);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Các khung giờ khả dụng trong ngày{" "}
          {selectedDate
            ? selectedDate.toLocaleDateString("vi-VN", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })
            : "Chọn ngày"}
        </Text>
      </View>

      <View style={styles.timeSlotsContainer}>
        <ScrollView>
          <View style={styles.timeSlots}>
            {restaurant.bookingHours.map((hour, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  {
                    backgroundColor:
                      selectedTime === hour
                        ? Colors.primary
                        : isPastTime(hour)
                        ? "#D0D0D0"
                        : "#ffffff",
                  },
                ]}
                onPress={() => setSelectedTime(hour)}
                disabled={isPastTime(hour)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    {
                      color:
                        selectedTime === hour
                          ? "#ffffff"
                          : isPastTime(hour)
                          ? "#666666"
                          : "#666666",
                    },
                  ]}
                >
                  {hour}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.popupContainer}>
        <PopUp buttonText="Áp dụng" onPress={handleApply} />
      </View>
    </View>
  );
};

export default BookingHours;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    flex: 1,
  } as ViewStyle,
  header: {
    height: 100,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
  } as ViewStyle,
  closeButton: {
    position: "absolute",
    left: 15,
    padding: 10,
  } as ViewStyle,
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: "75%",
  } as TextStyle,
  timeSlotsContainer: {
    height: 300,
    backgroundColor: "#ffffff",
    marginTop: 50,
  } as ViewStyle,
  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    justifyContent: "space-around",
  } as ViewStyle,
  timeSlot: {
    padding: 10,
    width: "20%",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "#D0D0D0",
    borderWidth: 1.5,
    marginTop: 5,
  } as ViewStyle,
  timeSlotText: {
    fontWeight: "bold",
    fontSize: 16,
  } as TextStyle,
  popupContainer: {
    height: 500,
    backgroundColor: "#FAFAFA",
    justifyContent: "flex-end",
  } as ViewStyle,
});
