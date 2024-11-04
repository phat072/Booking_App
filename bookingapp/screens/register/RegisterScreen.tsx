import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS, SIZES } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import styles from "../../constants/LoginStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import BackBtn from "../../components/button/BackButton";
import Button from "../../components/button/Button";
import { API_URL } from "@env";

const RegisterScreen: React.FC = () => {
  const animation = useRef(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const navigation = useNavigation();
  const [obsecureText, setObsecureText] = useState<boolean>(true);

  const validatePassword = (password: string): boolean => {
    const passwordErrors: string[] = [];

    // Check for lowercase letter
    if (!/(?=.*[a-z])/.test(password)) {
      passwordErrors.push("Mật khẩu phải chứa ít nhất một chữ thường.");
    }

    // Check for uppercase letter
    if (!/(?=.*[A-Z])/.test(password)) {
      passwordErrors.push("Mật khẩu phải chứa ít nhất một chữ hoa.");
    }

    // Check for digit
    if (!/(?=.*\d)/.test(password)) {
      passwordErrors.push("Mật khẩu phải chứa ít nhất một số.");
    }

    // Check for special character
    if (!/(?=.*[!@#$%^&*()_+])/.test(password)) {
      passwordErrors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");
    }

    // Check minimum length
    if (password.length < 8) {
      passwordErrors.push("Mật khẩu phải có ít nhất 8 ký tự.");
    }

    // Set error messages
    if (passwordErrors.length > 0) {
      setPasswordError(passwordErrors);
      return false;
    } else {
      setPasswordError([]);
      return true;
    }
  };

  const handleRegister = () => {
    console.log("Register button clicked");
    setLoader(true);
    const isPasswordValid = validatePassword(password);
    console.log("Password valid:", isPasswordValid);
  
    if (isPasswordValid) {
        const user = { name, email, password };
        axios
            .post(
              `${API_URL}/register`, 
              user, 
              { 
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000 
              }
            )
            .then((response) => {
                console.log("API response:", response);
                Alert.alert("Thành công", "Chúc mừng bạn đã đăng ký thành công");
                setName("");
                setEmail("");
                setPassword("");
                navigation.navigate("Login" as never);
            })
            .catch((error) => {
                Alert.alert("Thất bại", "Vui lòng nhập đầy đủ và chính xác thông tin để đăng ký.");
                console.error("Đăng ký thất bại", error);
            })
            .finally(() => {
                setLoader(false);
            });
    } else {
        setLoader(false);
        console.log("Password validation failed", passwordError);
    }
  };  

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{ marginHorizontal: 20, marginTop: 50 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: "100%", height: SIZES.height / 3.2 }}
            source={require("../../assets/lottie/login.json")}
          />
        </View>
        <BackBtn onPress={() => navigation.goBack()} />
        <Text style={styles.titleLogin}>Đăng ký tài khoản</Text>

        <KeyboardAvoidingView>
          <View>
            <View style={styles.wrapper}>
              <Text style={styles.label}>Họ và tên</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.offwhite }]}>
                <MaterialCommunityIcons
                  name="face-man-profile"
                  size={20}
                  color={COLORS.gray}
                  style={styles.iconStyle}
                />
                <TextInput
                  placeholder="Nhập họ và tên"
                  onChangeText={(text) => setName(text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            <View style={styles.wrapper}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.offwhite }]}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={COLORS.gray}
                  style={styles.iconStyle}
                />
                <TextInput
                  placeholder="Nhập email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            <View style={styles.wrapper}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: passwordError.length > 0 ? COLORS.error : COLORS.offwhite }
                ]}
              >
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={COLORS.gray}
                  style={styles.iconStyle}
                />
                <TextInput
                  secureTextEntry={obsecureText}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ flex: 1 }}
                />
                <TouchableOpacity onPress={() => setObsecureText(!obsecureText)}>
                  <MaterialCommunityIcons
                    name={obsecureText ? "eye-off-outline" : "eye-outline"}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
              {passwordError.length > 0 && (
                <View style={{ marginTop: 5 }}>
                  {passwordError.map((error, index) => (
                    <Text key={index} style={{ color: COLORS.error, fontSize: 12 }}>
                      {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <Button
              title={"ĐĂNG KÝ"}
              onPress={handleRegister}
              loader={loader} isValid={true}            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
