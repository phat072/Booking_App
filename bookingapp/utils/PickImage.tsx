import * as ImagePicker from 'expo-image-picker';

type PickImagesOptions = {
  currentImages?: string[];
  multiple?: boolean;
};

export const pickImages = async ({
  currentImages = [],
  multiple = false,
}: PickImagesOptions): Promise<string[]> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: multiple,
      quality: 1,
    });

    if (result.canceled) {
      return currentImages;
    }

    const newImages = multiple
      ? [...currentImages, ...result.assets.map(asset => asset.uri)]
      : [...currentImages, result.assets[0].uri];

    return newImages;
  } catch (error) {
    console.error("Error picking images:", error);
    return currentImages;
  }
};