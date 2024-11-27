import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <View style={styles.zoomContainer}>
      <TouchableOpacity onPress={onZoomIn} style={styles.zoomButton}>
        <Text style={styles.zoomText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onZoomOut} style={styles.zoomButton}>
        <Text style={styles.zoomText}>-</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  zoomContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    padding: 3,
  },
  zoomButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,    // Padding chiều ngang (X-axis)
    paddingVertical: 5,      // Padding chiều dọc (Y-axis)
  },
  zoomText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008E97",
  },
});

export default ZoomControls;
