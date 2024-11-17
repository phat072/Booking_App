import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AccountItem {
  icon: string;
  text: string;
  action: () => void;
  connected?: boolean;
}

const Privacy: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getTokenFromAsyncStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("user");
        setToken(storedToken);
      } catch (error) {
        console.error("Error reading token from AsyncStorage:", error);
      }
    };

    getTokenFromAsyncStorage();
  }, []);

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile", {
      user: {
        ...JSON.parse(token || "{}")?.user?.user,
        name: JSON.parse(token || "{}")?.user?.user?.username,
      },
    });
  };

  const navigationFunctions = {
    navigateToSecurity: () => navigation.navigate("DataSecurityScreen"),
    navigateToPrivacy: () => navigation.navigate("Privacy"),
    navigateToSubscription: () => console.log("Subscription function"),
    navigateToSupport: () => navigation.navigate("AideEtSupport"),
    navigateToCategory: () => console.log("Category"),
    navigateToLanguage: () => navigation.navigate("LanguageSelectionScreen"),
    navigateToMoney: () => console.log("Money"),
    navigateToSave: () => console.log("Save"),
    navigateToTermsAndPolicies: () => navigation.navigate("UseCondition"),
    navigateToReportProblem: () => navigation.navigate("ReportProblemScreen"),
    logout: () => console.log("Logout"),
    navigateToMagicValidation: () => navigation.navigate("MagicValidation"),
  };

  const accountItems: AccountItem[] = [
    {
      icon: "person-outline",
      text: "Modifier votre Profile",
      action: navigateToEditProfile,
      connected: !!JSON.parse(token || "{}")?.user?.user,
    },
    {
      icon: "security",
      text: "Sécurité",
      action: navigationFunctions.navigateToSecurity,
    },
    {
      icon: "lock-outline",
      text: "Politique de confidentialité",
      action: navigationFunctions.navigateToPrivacy,
    },
    {
      icon: "attach-money",
      text: "Monnaie principale",
      action: navigationFunctions.navigateToMoney,
    },
    {
      icon: "category",
      text: "Mes catégories",
      action: navigationFunctions.navigateToCategory,
    },
  ];

  const supportItems: AccountItem[] = [
    {
      icon: "credit-card",
      text: "Mon porte-monnaie électronique",
      action: navigationFunctions.navigateToSubscription,
    },
    {
      icon: "help-outline",
      text: "Aide & Support",
      action: navigationFunctions.navigateToSupport,
    },
    {
      icon: "info-outline",
      text: "Condition d'utilisation",
      action: navigationFunctions.navigateToTermsAndPolicies,
    },
  ];

  const actionsItems: AccountItem[] = [
    {
      icon: "outlined-flag",
      text: "Signaler un problème",
      action: navigationFunctions.navigateToReportProblem,
    },
    {
      icon: "save",
      text: "Exporter les données",
      action: navigationFunctions.navigateToSave,
    },
    {
      icon: "language",
      text: "Langues",
      action: navigationFunctions.navigateToLanguage,
    },
    {
      icon: "logout",
      text: "Déconnexion",
      action: navigationFunctions.logout,
    },
    {
      icon: "settings",
      text: "Magic Validation",
      action: navigationFunctions.navigateToMagicValidation,
    },
  ];

  const renderSettingsItem = ({ icon, text, action, connected = true }: AccountItem) => {
    if (!connected) return null;

    return (
      <TouchableOpacity onPress={action} style={styles.settingsItem}>
        <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={24} color="black" />
        <Text style={styles.settingsText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-backspace" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Parametres</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <View style={styles.sectionContent}>
            {accountItems.map((item, index) => (
              <React.Fragment key={index}>{renderSettingsItem(item)}</React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A propos</Text>
          <View style={styles.sectionContent}>
            {supportItems.map((item, index) => (
              <React.Fragment key={index}>{renderSettingsItem(item)}</React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.sectionContent}>
            {actionsItems.map((item, index) => (
              <React.Fragment key={index}>{renderSettingsItem(item)}</React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    marginHorizontal: 12,
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
  },
  scrollContainer: {
    marginHorizontal: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContent: {
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 5,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 12,
  },
  settingsText: {
    marginLeft: 36,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Privacy;
