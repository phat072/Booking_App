import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  SimpleLineIcons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/Theme";

type FontType = 1 | 2 | 3 | 4 | 5;

interface ProfileTileProps {
  onPress?: () => void;
  title: string;
  icon: string;
  font: FontType;
  temp?: string | number;
}

const ProfileTile: React.FC<ProfileTileProps> = ({
  onPress,
  title,
  icon,
  font = 1, // Default value for font
  temp,
}) => {
  const renderIcon = () => {
    switch (font) {
      case 1:
        return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={COLORS.gray} />;
      case 2:
        return <SimpleLineIcons name={icon as keyof typeof SimpleLineIcons.glyphMap} size={20} color={COLORS.gray} />;
      case 3:
        return <Feather name={icon as keyof typeof Feather.glyphMap} size={20} color={COLORS.gray} />;
      case 4:
        return <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={20} color={COLORS.gray} />;
      case 5:
        return <AntDesign name={icon as keyof typeof AntDesign.glyphMap} size={22} color={COLORS.gray} />;
      default:
        return null;
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
  } as ViewStyle,
  inner: {
    flexDirection: "row",
    marginHorizontal: 20,
    alignItems: "center",
    marginVertical: 6,
  } as ViewStyle,
  row: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  text: {
    marginLeft: 10,
    fontFamily: "regular",
    fontSize: 17,
    color: "black",
  } as TextStyle,
  text1: {
    marginLeft: 10,
    fontFamily: "regular",
    fontSize: 17,
    color: COLORS.gray,
  } as TextStyle,
  iconRight: {
    bottom: -3,
    marginRight: 10,
  } as ViewStyle,
});
