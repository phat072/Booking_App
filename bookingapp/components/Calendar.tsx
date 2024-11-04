import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import moment, { Moment } from "moment";

interface CalendarProps {
  setSelectedWeek: (week: { startOfWeek: Moment; endOfWeek: Moment } | null) => void;
  handleClosePress: () => void;
  resetTrigger: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ setSelectedWeek, handleClosePress, resetTrigger }) => {
  const [internalSelectedWeek, setInternalSelectedWeek] = useState<{ startOfWeek: Moment; endOfWeek: Moment } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);

  useEffect(() => {
    if (resetTrigger) {
      clearSelection();
    }
  }, [resetTrigger]);

  const onDateChange = (date: Moment) => {
    setSelectedDate(date);
    const startOfWeek = moment(date).startOf("isoWeek");
    const endOfWeek = moment(date).endOf("isoWeek");
    setInternalSelectedWeek({ startOfWeek, endOfWeek });
  };

  const clearSelection = () => {
    setInternalSelectedWeek(null);
    setSelectedDate(null);
  };

  const getCustomDatesStyles = (date: Moment) => {
    if (!internalSelectedWeek) return {};
    const { startOfWeek, endOfWeek } = internalSelectedWeek;

    if (moment(date).isBetween(startOfWeek, endOfWeek, null, "[]")) {
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
    <View style={styles.container}>
      <CalendarPicker
        onDateChange={onDateChange}
        customDatesStyles={getCustomDatesStyles}
        selectedStartDate={selectedDate}
        startFromMonday={true}
        todayBackgroundColor="#577B8D"
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
      />

      <Text style={styles.selectedWeekText}>
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
  container: {
    marginTop: 8,
  },
  selectedWeekText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#FF0000",
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
    borderColor: "#9A9A9A",
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 16,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#313131",
  },
});

export default Calendar;
