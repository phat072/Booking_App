import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

interface HomeAdminCardProps {
  title: string;
  iconUri: string;
  borderColor: string;
  bgColor: string;
  onPress: () => void;
}

const HomeAdminCard: React.FC<HomeAdminCardProps> = ({ title, iconUri, borderColor, bgColor, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.shadow}>
      <View className="w-[120] h-[180] items-center justify-center border border-[#DDDDDD] rounded-lg">
        <View
          style={{
            borderColor: borderColor,
            borderWidth: 2,
            width: 60,
            height: 60,
            borderRadius: 100,
            backgroundColor: bgColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            width={25}
            height={25}
            source={{
              uri: iconUri,
            }}
          />
        </View>
        <Text style={{ marginTop: 8, fontWeight: "600" }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HomeAdminCard;

const styles = StyleSheet.create({
  shadow: {
    marginTop:20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});