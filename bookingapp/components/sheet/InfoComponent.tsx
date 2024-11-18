import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const InfoComponent = () => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.section}>
        <Text style={styles.name}>Bò Tơ Quán Mộc - Trần Văn Giàu</Text>
        <View style={styles.row}>
          <FontAwesome6 name="location-dot" size={24} color="black" />
          <Text>Số 206-210 Trần Văn Giàu, P.Bình Trị Đông, Q.Bình Tân</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome6 name="location-dot" size={24} color="black" />
          <Text>Gọi món Việt (chuyên bò tơ)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: "#fff",
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});

export default InfoComponent;
