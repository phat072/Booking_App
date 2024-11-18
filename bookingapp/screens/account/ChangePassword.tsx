import React, { useContext, useState } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_URL } from "@env";
import { UserType } from "@/userContext";
import PopUp from "@/components/menu/Popup";
import { TextInput } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";

interface ChangePasswordProps {
  navigation: NavigationProp<any>;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { user } = useContext(UserType);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "New Password and Confirm Password do not match");
        return;
      }
      const response = await fetch(`${API_URL}/change-password/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      Alert.alert("Success", "Password changed successfully");
      navigation.goBack();
    } catch (error: any) {
      console.error("API Error:", error.message);
      Alert.alert("Error", "Failed to change password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {/* Input Old Password */}
        <View style={styles.inputContainer}>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            mode="outlined"
            label="Type old password"
            secureTextEntry={!showOldPassword}
            right={
              <TextInput.Icon
                icon={showOldPassword ? "eye-off" : "eye"}
                onPress={() => setShowOldPassword(!showOldPassword)}
              />
            }
            outlineColor="#D9D9D9"
            activeOutlineColor="#D73724"
            style={styles.textInput}
          />
        </View>
        {/* Input New Password */}
        <View style={styles.inputContainer}>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            mode="outlined"
            label="Type new password"
            secureTextEntry={!showNewPassword}
            right={
              <TextInput.Icon
                icon={showNewPassword ? "eye-off" : "eye"}
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            }
            outlineColor="#D9D9D9"
            activeOutlineColor="#D73724"
            style={styles.textInput}
          />
        </View>
        {/* Input Confirm Password */}
        <View style={styles.inputContainer}>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            label="Type new password again"
            secureTextEntry={!showConfirmPassword}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            outlineColor="#D9D9D9"
            activeOutlineColor="#D73724"
            style={styles.textInput}
          />
        </View>
      </View>
      <PopUp buttonText="UPDATE" onPress={handleChangePassword} />
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    justifyContent: "space-between",
  } as ViewStyle,
  inputContainer: {
    marginBottom: 16,
  } as ViewStyle,
  textInput: {
    height: 60,
  } as TextStyle,
});
