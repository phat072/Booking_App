import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  AntDesign,
  Ionicons,
  SimpleLineIcons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/Theme";

interface ProfileTileProps {
  onPress?: () => void;
  title: string;
  icon: string; // Chỉ nhận tên biểu tượng
  font?: number; // Loại font biểu tượng
  temp?: string;
}

const ProfileTile: React.FC<ProfileTileProps> = ({ onPress, title, icon, font, temp }) => {
  console.log('ProfileTile props:', { title, icon, font, onPress });
  const renderIcon = () => {
    switch (font) {
      case 1:
        return <Ionicons name={icon as any} size={24} color={COLORS.gray} />;
      case 2:
        return <SimpleLineIcons name={icon as any} size={20} color={COLORS.gray} />;
      case 3:
        return <Feather name={icon as any} size={20} color={COLORS.gray} />;
      case 4:
        return <MaterialCommunityIcons name={icon as any} size={20} color={COLORS.gray} />;
      default:
        return <AntDesign name={icon as any} size={22} color={COLORS.gray} />;
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.outer}>
        <View style={styles.inner}>
          {renderIcon()}
          <Text style={styles.text}>{title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text1}>{temp}</Text>
          <AntDesign
            name="right"
            size={18}
            color={COLORS.gray2}
            style={styles.iconRight}
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
  outer: {
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
  row: {
    flexDirection: "row",
  },
  iconRight: {
    bottom: -3,
    marginRight: 10,
  },
});
