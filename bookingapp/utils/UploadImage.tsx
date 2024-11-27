import {
    View,
    Text,
    StyleSheet,
    Clipboard,
    TouchableOpacity,
    Image,
    TextInput,
  } from "react-native";
  import React from "react";
  import { FontAwesome6 } from "@expo/vector-icons";
  
  interface ImageUploaderProps {
      title: string;
      images: string[];
      setImages: (images: string[]) => void;
      urls: string[];
      setUrls: (urls: string[]) => void;
      inputUrl: string;
      setInputUrl: (url: string) => void;
      handlePickImages: (imageState: any, setImages: (images: string[]) => void, allowMultipleSelection: boolean) => void;
      imageState: any;
      allowMultipleSelection: boolean;
  }
  
  const ImageUploader: React.FC<ImageUploaderProps> = ({
      title,
      images,
      setImages,
      urls,
      setUrls,
      inputUrl,
      setInputUrl,
      handlePickImages,
      imageState,
      allowMultipleSelection,
  }) => {
    const handlePaste = async () => {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent) {
        setUrls([...urls, clipboardContent]);
        setInputUrl("");
      }
    };
    
    const handleAddUrl = () => {
      if (inputUrl) {
        setUrls([...urls, inputUrl]);
        setInputUrl("");
      }
    }
  
    const removeImage = (index: number) => {
      if (index < images.length) {
        setImages(images.filter((_, i) => i !== index));
      } else {
        const updatedUrls = [...urls];
        updatedUrls.splice(index - images.length, 1);
        setUrls(updatedUrls);
      }
    };
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={() =>
            handlePickImages(imageState, setImages, allowMultipleSelection)
          }
          style={styles.uploadButton}
        >
          <Image
            style={styles.tinyLogo}
            source={{
              uri:
                images.length > 0
                  ? images[0]
                  : urls.length > 0
                  ? urls[0]
                  : "https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg",
            }}
          />
          {(images.length > 0 || urls.length > 0) && (
            <TouchableOpacity
              style={styles.removeLargeIconContainer}
              onPress={() => removeImage(0)}
            >
              <FontAwesome6 name="xmark" size={16} color="white" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <View style={styles.imageList}>
          {[...images, ...urls].slice(1).map((item, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image style={styles.smallImage} source={{ uri: item }} />
              <TouchableOpacity
                style={styles.removeIconContainer}
                onPress={() => removeImage(index + 1)}
              >
                <FontAwesome6 name="xmark" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.TextInput}
            placeholder="Paste URL here"
            value={inputUrl}
            onChangeText={setInputUrl}
          />
          <TouchableOpacity onPress={handlePaste} style={styles.button}>
            <Text style={styles.buttonText}>Paste</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddUrl} style={styles.button}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  export default ImageUploader;
  
  const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      textAlign: "center",
      marginBottom: 16,
      fontStyle: "italic",
      color: "#0E7490",
      fontWeight: "bold",
    },
    uploadButton: {
      borderStyle: "dashed",
      borderWidth: 2,
      borderColor: "#4F46E5",
      padding: 8,
      marginTop: 35,
      borderRadius: 20,
      elevation: 2,
    },
    tinyLogo: {
      width: "100%",
      height: 250,
      objectFit: "cover",
    },
    imageList: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: 20,
    },
    imageWrapper: {
      margin: 5,
      position: "relative",
    },
    smallImage: {
      width: 50,
      height: 50,
      borderRadius: 10,
    },
    removeIconContainer: {
      position: "absolute",
      top: -4,
      left: -7,
      backgroundColor: Colors.primary,
      borderRadius: 50,
      width: 15,
      height: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    removeLargeIconContainer: {
      position: "absolute",
      top: 1,
      left: 0,
      backgroundColor: Colors.primary,
      borderRadius: 50,
      width: 25,
      height: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    TextInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 10,
      borderRadius: 5,
      marginRight: 10,
    },
    button: {
      backgroundColor: "#0F67B1",
      padding: 10,
      borderRadius: 5,
      marginLeft: 5,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
  
    },
    imageContainer: {
      width: "100%",
    },
    image: {
      width: "100%",
      height: 200,
      marginBottom: 20,
    },
    placeholder: {
      marginTop: 20,
      color: "#888",
      textAlign: "center",
    },
  });