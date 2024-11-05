import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CalendarPicker, { CustomDatesStylesFunc } from "react-native-calendar-picker";
import moment, { Moment } from "moment";

interface CalendarProps {
  setSelectedWeek: (week: { startOfWeek: Moment; endOfWeek: Moment } | null) => void;
  handleClosePress: () => void;
  resetTrigger: boolean;
}

interface WeekRange {
  startOfWeek: Moment;
  endOfWeek: Moment;
}

const Calendar: React.FC<CalendarProps> = ({
  setSelectedWeek,
  handleClosePress,
  resetTrigger,
}) => {
  const [internalSelectedWeek, setInternalSelectedWeek] = useState<WeekRange | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Use undefined instead of null

  useEffect(() => {
    if (resetTrigger) {
      clearSelection();
    }
  }, [resetTrigger]);

  const onDateChange = (date: Date) => {
    const momentDate = moment(date);
    setSelectedDate(date); // Update selectedDate with a Date object
    const startOfWeek = momentDate.startOf("isoWeek");
    const endOfWeek = momentDate.endOf("isoWeek");
    setInternalSelectedWeek({ startOfWeek, endOfWeek });
  };

  const clearSelection = () => {
    setInternalSelectedWeek(null);
    setSelectedDate(undefined); // Reset selectedDate to undefined
  };

  const getCustomDatesStyles: CustomDatesStylesFunc = (date: Date) => {
    if (!internalSelectedWeek) return {};
    const { startOfWeek, endOfWeek } = internalSelectedWeek;

    const momentDate = moment(date);
    if (momentDate.isBetween(startOfWeek, endOfWeek, null, "[]")) {
      return {
        style: styles.selectedDate,
        textStyle: styles.selectedDateText,
      };
    }
    return {};
  };

  const applySelection = () => {
    setSelectedWeek(internalSelectedWeek);
    handleClosePress();
  };

  return (
    <View style={{ marginTop: 8 }}>
      <CalendarPicker
        onDateChange={onDateChange}
        customDatesStyles={getCustomDatesStyles}
        selectedStartDate={selectedDate || undefined} // Use undefined if selectedDate is not set
        startFromMonday={true}
        todayBackgroundColor="#577B8D"
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
      />

      <Text style={styles.text}>
        {internalSelectedWeek
          ? `Tuần đã chọn: Từ ${internalSelectedWeek.startOfWeek.format("DD/MM/YYYY")} đến ${internalSelectedWeek.endOfWeek.format("DD/MM/YYYY")}`
          : "Chọn một ngày để chọn tuần"}
      </Text>

      <TouchableOpacity onPress={applySelection} style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  selectedDate: {
    backgroundColor: "#ffccff",
  },
  selectedDateText: {
    color: "#000",
  },
  applyButton: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 16,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Calendar;
