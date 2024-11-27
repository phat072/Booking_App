import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "@/constants/Colors";

interface PopUpProps {
  buttonText: string;
  onPress: (item: any) => void; 
}

const PopUp: React.FC<PopUpProps> = ({ buttonText, onPress }) => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const item = params;

  return (
    <View style={styles.popupContainer}>
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => {
          onPress(item);
        }}
      >
        <Text style={styles.applyButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  applyButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    width: "90%",
  },
  applyButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  popupContainer: {
    backgroundColor: "white",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
