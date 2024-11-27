import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { CheckBox, Icon, Divider } from "react-native-elements";
import { Shadow } from "react-native-shadow-2";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CityStackParamList } from "../type";
import Colors from "@/constants/Colors";

type CityScreenProps = NativeStackScreenProps<CityStackParamList, "City">;

const CityScreen: React.FC<CityScreenProps> = ({ navigation, route }) => {
  const { selectedCity: initialSelectedCity } = route.params;
  const [selectedCity, setLocalSelectedCity] = useState<string | null>(
    initialSelectedCity
  );

  const cities: string[] = ["Hà Nội", "TPHCM", "Đà Nẵng", "Khánh Hòa", "Vũng Tàu", "Long An"];
  const isButtonVisible: boolean =
    selectedCity !== initialSelectedCity && selectedCity !== null;

  const handleCitySelection = (city: string) => {
    setLocalSelectedCity(selectedCity === city ? null : city);
  };

  const handleApplyButton = () => {
    navigation.navigate({
      name: "HomeScreen",
      params: { selectedCity },
      merge: true, // Ensure parameters are merged
    });
  };
  

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: "100%" }}>
        {cities.map((city, index) => (
          <React.Fragment key={city}>
            <CheckBox
              title={city}
              textStyle={{ fontSize: 20, fontWeight: "600", color: "black" }}
              containerStyle={{
                backgroundColor: "#fff",
                borderColor: "#fff",
              }}
              checkedIcon={
                <Icon
                  name="radio-button-checked"
                  type="material"
                  color={Colors.primary}
                  size={30}
                  iconStyle={{ marginRight: 10 }}
                />
              }
              uncheckedIcon={
                <Icon
                  name="radio-button-unchecked"
                  type="material"
                  color="gray"
                  size={30}
                  iconStyle={{ marginRight: 10 }}
                />
              }
              checked={selectedCity === city}
              onPress={() => handleCitySelection(city)}
            />
            {index < cities.length - 1 && (
              <>
                <Text></Text>
                <Divider
                  style={{
                    backgroundColor: "#ccc",
                    width: "90%",
                    marginLeft: 20,
                  }}
                />
              </>
            )}
          </React.Fragment>
        ))}
      </View>
      {isButtonVisible && (
        <Shadow style={styles.popupContainer}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyButton}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </Shadow>
      )}
    </View>
  );
};

export default CityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  applyButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    width: "90%",
    borderRadius: 10,
  },
  applyButtonText: {
    width: 300,
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  popupContainer: {
    width: 600,
    height: 105,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
