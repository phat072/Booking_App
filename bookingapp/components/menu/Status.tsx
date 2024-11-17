import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

interface StatusProps {
  onPress: () => void;
  onPress1: () => void;
  setSelectedContentType: (contentType: string) => void;
  selectedStatus: string;
}

const Status: React.FC<StatusProps> = ({
  onPress,
  onPress1,
  setSelectedContentType,
  selectedStatus,
}) => {
  const labels = ["Trạng thái", "Dịch vụ"];

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {labels.map((label, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (index === 0) {
                onPress();
                setSelectedContentType("status");
              } else {
                onPress1();
                setSelectedContentType("services");
              }
            }}
          >
            <View style={styles.statusItem}>
              <Text>{index === 0 ? selectedStatus : label}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="black"
              />
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.dateItem}>
          <Text style={styles.dateText}>15/12/2023 - 14/01/2024</Text>
          <Entypo name="calendar" size={24} color="black" style={styles.icon} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 5,
  },
  statusItem: {
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 50,
    height: 40,
    width: "auto",
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 50,
    height: 40,
    width: "auto",
  },
  dateText: {
    marginLeft: 5,
  },
  icon: {
    marginLeft: 8,
  },
});

export default Status;
