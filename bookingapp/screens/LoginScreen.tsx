import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import Button from "../components/button/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/theme";
import styles from "../constants/LoginStyle";
import LottieView from "lottie-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '@env';
import { decode as base64Decode } from "base-64";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../app/types";

type LoginPageProps = {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .required("Yêu cầu"),
  email: Yup.string()
    .email("Vui lòng nhập địa chỉ email hợp lệ")
    .required("Yêu cầu"),
});

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {
  const animation = useRef<LottieView>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [obsecureText, setObsecureText] = useState<boolean>(true);

  const inValidForm = () => {
    Alert.alert("Không hợp lệ", "Hãy nhập vào đầy đủ các trường dữ liệu", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Continue",
        onPress: () => {},
      },
    ]);
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoader(true);

    try {
      const user = {
        email: values.email,
        password: values.password,
      };

      const response = await axios.post<{ token: string }>(`${API_URL}/login`, user);

      if (response.status === 200) {
        const token = response.data.token;
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(base64Decode(payloadBase64));
        const isAdmin = payload.admin;

        await AsyncStorage.setItem("authToken", response.data.token);

        if (isAdmin) {
          navigation.replace("Admin");
        } else {
          navigation.replace("Main");
        }
      } else {
        Alert.alert("Lỗi", "Hãy kiểm tra lại thông tin");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Lỗi", "Hãy kiểm tra lại thông tin");
    } finally {
      setLoader(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.white }}>
      <View style={{ marginHorizontal: 20, marginTop: 50 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: "100%", height: SIZES.height / 3.2 }}
            source={require("../assets/lottie/login.json")}
          />
        </View>
        <Text style={styles.titleLogin}>Đặt nhà hàng</Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          {({
            handleChange,
            handleBlur,
            touched,
            handleSubmit,
            values,
            errors,
            isValid,
            setFieldTouched,
          }) => (
            <View>
              <View style={styles.wrapper}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { borderColor: touched.email ? COLORS.secondary : COLORS.offwhite },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color={COLORS.gray}
                    style={styles.iconStyle}
                  />

                  <TextInput
                    placeholder="Nhập email"
                    onFocus={() => setFieldTouched("email")}
                    onBlur={() => setFieldTouched("email", false)}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1 }}
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorMessage}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.wrapper}>
                <Text style={styles.label}>Mật khẩu</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { borderColor: touched.password ? COLORS.secondary : COLORS.offwhite },
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
                    onFocus={() => setFieldTouched("password")}
                    onBlur={() => setFieldTouched("password", false)}
                    value={values.password}
                    onChangeText={handleChange("password")}
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
                {touched.password && errors.password && (
                  <Text style={styles.errorMessage}>{errors.password}</Text>
                )}
              </View>

              <Button
                loader={loader}
                title={"ĐĂNG NHẬP"}
                onPress={isValid ? handleSubmit : inValidForm}
                isValid={isValid}
              />
              <Text style={styles.label}>chưa có mật khẩu</Text>
              <Text
                style={styles.registration}
                onPress={() => navigation.navigate("Register")}
              >
                {" "}
                Đăng ký{" "}
              </Text>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default LoginPage;
