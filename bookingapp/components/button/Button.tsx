import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
  } from "react-native";
  import React from "react";
  import { COLORS } from "../../constants/Theme";
  
  interface ButtonProps {
    title: string;
    onPress: () => void;
    isValid: boolean;
    loader: boolean;
  }
  
  const Button: React.FC<ButtonProps> = ({ title, onPress, isValid, loader }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.btnStyle,
          { backgroundColor: isValid ? COLORS.primary : COLORS.gray },
        ]}
        disabled={!isValid}
      >
        {!loader ? (
          <Text style={styles.btnTxt}>{title}</Text>
        ) : (
          <ActivityIndicator color={COLORS.white} />
        )}
      </TouchableOpacity>
    );
  };
  
  export default Button;
  
  const styles = StyleSheet.create({
    btnTxt: {
      fontFamily: "bold",
      color: COLORS.white,
      fontSize: 18,
    },
    btnStyle: {
      height: 50,
      width: "100%",
      marginVertical: 20,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
    },
  });
  