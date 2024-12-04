import React from "react";
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { posts, PostItem } from "./post";
import { useNavigation } from "@react-navigation/native"; // Hook cho điều hướng
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import Colors from "@/constants/Colors"; // Import Colors để lấy màu primary

const BottomSheetTest = () => {
  const navigation = useNavigation(); // Hook cho điều hướng, chỉ dùng nếu bạn có hệ thống Navigation

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.log("No previous screen to go back to.");
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostItem post={item} />}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.primary, // Lấy màu primary từ Colors
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
});

export default BottomSheetTest;
