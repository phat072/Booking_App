import React, { useState, useRef, useContext } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode as base64Decode } from "base-64";
import { COLORS, SIZES } from "../../constants/Theme";
import styles from "../../constants/LoginStyle";
import Button from "../../components/button/Button";
import { API_URL } from "@env";
import { UserType } from "../../userContext";

interface LoginPageProps {
  navigation: any;
}

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .required("Yêu cầu"),
  email: Yup.string()
    .email("Vui lòng nhập địa chỉ email hợp lệ")
    .required("Yêu cầu"),
});

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {
  const animation = useRef(null);
  const [loader, setLoader] = useState(false);
  const [obsecureText, setObsecureText] = useState(true);
  const { setUserId, updateUser } = useContext(UserType);

  const inValidForm = () => {
    Alert.alert("Không hợp lệ", "Hãy nhập vào đầy đủ các trường dữ liệu", [
      { text: "Cancel", onPress: () => {} },
      { text: "Continue", onPress: () => {} },
    ]);
  };

  const handleLogin = async (values: { email: any; password: any; }) => {
    setLoader(true);
    try {
      const user = {
        email: values.email,
        password: values.password,
      };
      const response = await axios.post(`${API_URL}/login`, user);
      if (response.status === 200) {
        const token = response.data.token;
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(base64Decode(payloadBase64));
        const isAdmin = payload.admin;

        await AsyncStorage.setItem("authToken", response.data.token);

        // Set user data in context
        setUserId(payload.userId);
        updateUser(payload);

        if (isAdmin) {
          navigation.replace("Admin");
        } else {
          navigation.replace("Main");
        }
      }
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
            source={require("../../assets/lottie/login.json")}
          />
        </View>
        <Text style={styles.titleLogin}>BOOKING APP</Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            touched,
            handleSubmit,
            values,
            errors,
            isValid,
            setFieldTouched,
          }) => (
            <View>
              <InputField
                label="Email"
                icon="email-outline"
                placeholder="type your email"
                value={values.email}
                onChangeText={handleChange("email")}
                onFocus={() => setFieldTouched("email")}
                onBlur={() => setFieldTouched("email", false)}
                touched={touched.email}
                error={errors.email}
              />
              <InputField
                label="Password"
                icon="lock-outline"
                placeholder="type your password"
                value={values.password}
                onChangeText={handleChange("password")}
                onFocus={() => setFieldTouched("password")}
                onBlur={() => setFieldTouched("password", false)}
                touched={touched.password}
                error={errors.password}
                secureTextEntry={obsecureText}
                toggleSecureTextEntry={() => setObsecureText(!obsecureText)}
              />
              <Button
                loader={loader}
                title="LOGIN"
                onPress={isValid ? handleSubmit : inValidForm}
                isValid={isValid}
              />
              <Text style={styles.label}>Forget password ?</Text>
              <Text
                style={styles.registration}
                onPress={() => navigation.navigate("Register")}
              >
                REGISTER
              </Text>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

interface InputFieldProps {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  touched?: boolean;
  error?: string;
  secureTextEntry?: boolean;
  toggleSecureTextEntry?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  onFocus,
  onBlur,
  touched,
  error,
  secureTextEntry,
  toggleSecureTextEntry,
}) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
  <View style={[styles.inputWrapper, { backgroundColor: touched ? COLORS.secondary : COLORS.offwhite }]}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={COLORS.gray}
        style={styles.iconStyle}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ flex: 1 }}
      />
      {toggleSecureTextEntry && (
        <TouchableOpacity onPress={toggleSecureTextEntry}>
          <MaterialCommunityIcons
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={18}
          />
        </TouchableOpacity>
      )}
    </View>
    {touched && error && <Text style={styles.errorMessage}>{error}</Text>}
  </View>
);

export default LoginPage;
