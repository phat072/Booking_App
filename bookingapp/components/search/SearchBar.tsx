// SearchBar.js
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SearchBarProps } from "../type";

const SearchBar: React.FC<SearchBarProps> = ({ searchPhrase, setSearchPhrase }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#34DBA1" style={{ marginLeft: 1 }} />
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm orders"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          placeholderTextColor="#A5B1AF" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",

  },
  searchBar: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    alignItems: "center",
    borderColor : "#E9ECEC",
    borderWidth: 2,
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
});

export default SearchBar;