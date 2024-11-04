import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  AntDesign,
  Ionicons,
  SimpleLineIcons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/theme";

// Define union types for each icon library
type AntDesignIcons = "right" | "heart" | "user" | "adduser";
type IoniconsIcons = "chatbox-outline" | "settings-outline";
type SimpleLineIconsIcons = "clock";
type FeatherIcons = "bar-chart" | "lock" | "camera";
type MaterialCommunityIconsIcons = "home" | "star" | "pause" | "book";

// Define a union of all possible icon names
type IconNames = AntDesignIcons | IoniconsIcons | SimpleLineIconsIcons | FeatherIcons | MaterialCommunityIconsIcons;

type ProfileTileProps = {
  onPress: () => void;
  title: string;
  icon: IconNames;
  font: number;
  temp?: string;
};

const ProfileTile: React.FC<ProfileTileProps> = ({ onPress, title, icon, font, temp }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.outter}>
        <View style={styles.inner}>
          {font === 1 ? (
            <Ionicons name={icon as IoniconsIcons} size={24} color={COLORS.gray} />
          ) : font === 2 ? (
            <SimpleLineIcons name={icon as SimpleLineIconsIcons} size={20} color={COLORS.gray} />
          ) : font === 3 ? (
            <Feather name={icon as FeatherIcons} size={20} color={COLORS.gray} />
          ) : font === 4 ? (
            <MaterialCommunityIcons name={icon as MaterialCommunityIconsIcons} size={20} color={COLORS.gray} />
          ) : (
            <AntDesign name={icon as AntDesignIcons} size={22} color={COLORS.gray} />
          )}
          <Text style={styles.text}>{title}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text1}>{temp}</Text>
          <AntDesign
            name="right"
            size={18}
            color={COLORS.gray2}
            style={{ bottom: -3, marginRight: 10 }}
          />
        </View>
      </View>
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

export default ProfileTile;

const styles = StyleSheet.create({
  divider: {
    borderColor: COLORS.gray2,
    opacity: 0.7,
    borderWidth: 0.3,
    width: SIZES.width - 35,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 7,
  },
  outter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inner: {
    flexDirection: "row",
    marginHorizontal: 20,
    alignItems: "center",
    marginVertical: 6,
  },
  text: {
    marginLeft: 10,
    fontFamily: "regular",
    fontSize: 17,
    color: "black",
  },
  text1: {
    marginLeft: 10,
    fontFamily: "regular",
    fontSize: 17,
    color: COLORS.gray,
  },
});
