import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { API_URL } from "@env";
import { Avatar, Button, Icon, Overlay } from "@rneui/themed";
import { SpeedDial } from "@rneui/themed";

// Define types for category and the component state
interface CategoryItem {
  _id: string;
  name: string;
  image: string;
}

const Category: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function fetchCategories() {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data: CategoryItem[] = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching categories");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
        <Button
          buttonStyle={styles.retryButton}
          onPress={fetchCategories}
          title="Retry"
        />
      </View>
    );
  }

  const renderCategoryItem = (item: CategoryItem) => (
    <TouchableOpacity key={item._id}>
      <View
        style={[
          selectedCategory === item._id && isDeleteMode
            ? styles.selected
            : null,
        ]}
        className="w-[120] h-[140] bg-white items-center justify-center border border-[#DDDDDD] rounded-lg mt-2"
      >
        <Avatar
          avatarStyle={{ objectFit: "cover" }}
          size={100}
          rounded
          source={{ uri: item.image }}
        />
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        className={`flex flex-row justify-around ${
          !isDeleteMode ? "hidden" : ""
        }`}
      >
        <Button
          title="Select to delete"
          loading={false}
          loadingProps={{ size: "small", color: "white" }}
          buttonStyle={{
            backgroundColor: "rgba(214, 61, 57, 1)",
            borderRadius: 5,
          }}
          containerStyle={{
            height: 50,
            width: 150,
            marginTop: 20,
          }}
        />
        <Button
          title="Delete all"
          loading={false}
          loadingProps={{ size: "small", color: "white" }}
          buttonStyle={{
            backgroundColor: "rgba(214, 61, 57, 1)",
            borderRadius: 5,
          }}
          containerStyle={{
            marginTop: 20,
            height: 50,
            width: 150,
          }}
        />
        <Button
          title="cancel"
          loading={false}
          loadingProps={{ size: "small", color: "white" }}
          buttonStyle={{
            backgroundColor: "rgba(214, 61, 57, 1)",
            borderRadius: 5,
          }}
          containerStyle={{
            marginTop: 20,
            height: 50,
            width: 70,
          }}
          onPress={() => setIsDeleteMode(!isDeleteMode)}
        />
      </View>
      <View className="flex flex-row flex-wrap justify-around h-screen">
        {categories.map((item) => renderCategoryItem(item))}
      </View>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlay}
      >
        <Text style={styles.title}>Add Category</Text>
        <View style={styles.imageContainer}>
          <Icon name="image" size={70} color="black" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Category Name"
          value={categoryName}
          onChangeText={setCategoryName}
        />
        <Button
          title="Save"
          onPress={() => {
            // Handle save category
            toggleOverlay();
          }}
          buttonStyle={styles.button}
        />
        <Button
          title="Cancel"
          onPress={toggleOverlay}
          buttonStyle={styles.cancelButton}
          type="outline"
        />
      </Overlay>
      <SpeedDial
        isOpen={open}
        icon={{ name: "edit", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
        buttonStyle={{
          backgroundColor: "rgba(111, 202, 186, 1)",
        }}
      >
        <SpeedDial.Action
          icon={{ name: "add", color: "#fff" }}
          title="Add"
          buttonStyle={{ backgroundColor: "rgba(127, 220, 103, 1)" }}
          onPress={() => {
            setOpen(false);
            toggleOverlay();
          }}
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "#fff" }}
          buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
          title="Delete"
          onPress={() => {
            toggleDeleteMode();
            setOpen(false);
          }}
        />
        <SpeedDial.Action
          icon={{ name: "edit", color: "#fff" }}
          buttonStyle={{ backgroundColor: "rgba(255, 193, 7, 1)" }}
          title="Edit"
          onPress={() => console.log("Edit Something")}
        />
      </SpeedDial>
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: "#FF6347",
  },
  selected: {
    borderColor: "red",
    borderWidth: 2,
    margin: 4,
  },
  overlay: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#3498db',
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#3498db',
    marginBottom: 10,
  },
  cancelButton: {
    borderColor: '#3498db',
    color: '#3498db',
  },
});
