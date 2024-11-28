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
import Colors from "@/constants/Colors";

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
        style={[selectedCategory === item._id && isDeleteMode ? styles.selected : null]}
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
      <View style={styles.buttonContainer}>
        <Button
          title="Select"
          onPress={toggleDeleteMode}
          buttonStyle={styles.selectButton}
          containerStyle={styles.selectButtonContainer}
        />
        <Button
          title="Delete all"
          onPress={toggleDeleteMode}
          buttonStyle={styles.selectButton}
          containerStyle={styles.selectButtonContainer}
        />
        <Button
          title="Cancel"
          onPress={() => setIsDeleteMode(!isDeleteMode)}
          buttonStyle={styles.cancelButton}
          containerStyle={styles.selectButtonContainer}
        />
      </View>

      <View style={styles.categoryList}>
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
          onPress={toggleOverlay}
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
        buttonStyle={styles.speedDialButton}
      >
        <SpeedDial.Action
          icon={{ name: "add", color: "#fff" }}
          title="Add"
          buttonStyle={styles.actionButtonAdd}
          onPress={() => {
            setOpen(false);
            toggleOverlay();
          }}
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "#fff" }}
          buttonStyle={styles.actionButtonDelete}
          title="Delete"
          onPress={() => {
            toggleDeleteMode();
            setOpen(false);
          }}
        />
        <SpeedDial.Action
          icon={{ name: "edit", color: "#fff" }}
          buttonStyle={styles.actionButtonEdit}
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
    borderColor: Colors.primary,
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
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  selectButton: {
    backgroundColor: "rgba(214, 61, 57, 1)",
    borderRadius: 5,
  },
  selectButtonContainer: {
    height: 40,
    width: 120,
    marginTop: 20,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 20,
  },
  speedDialButton: {
    backgroundColor: "rgba(111, 202, 186, 1)",
  },
  actionButtonAdd: {
    backgroundColor: "rgba(127, 220, 103, 1)",
  },
  actionButtonDelete: {
    backgroundColor: "rgba(214, 61, 57, 1)",
  },
  actionButtonEdit: {
    backgroundColor: "rgba(255, 193, 7, 1)",
  },
});
