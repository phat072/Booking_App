import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

interface HomeAdminCardProps {
  title: string;
  iconUri: string;
  borderColor: string;
  bgColor: string;
  onPress: () => void;
  children?: React.ReactNode;
}

const HomeAdminCard: React.FC<HomeAdminCardProps> = ({ title, iconUri, borderColor, bgColor, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.shadow}>
      <View style={[styles.card, { borderColor: borderColor }]}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Image source={{ uri: iconUri }} style={styles.icon} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HomeAdminCard;

const styles = StyleSheet.create({
  shadow: {
    marginTop: 10,  // Reduced margin for smaller screens
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    width: 70, // Smaller card width for mobile
    height: 70, // Adjusted card height
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderRadius: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: {
    width: 30,  // Smaller icon size for mobile
    height: 30, // Smaller icon size for mobile
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',      // Smaller text size for mobile
    textAlign: "center",
  },
});
