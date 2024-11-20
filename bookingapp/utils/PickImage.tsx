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
    // Kiểm tra quyền truy cập hình ảnh
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      console.error('Permission to access media library is required!');
      return currentImages;
    }

    // Chọn hình ảnh từ thư viện
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: multiple, // hỗ trợ chọn nhiều hình ảnh
      quality: 1,
    });

    // Nếu người dùng hủy bỏ, trả về danh sách hiện tại
    if (result.canceled) {
      return currentImages;
    }

    // Lấy các URI hình ảnh mới và cập nhật danh sách
    const newImages = multiple
      ? [...currentImages, ...result.assets.map(asset => asset.uri)]
      : [...currentImages, result.assets[0].uri];

    return newImages;
  } catch (error) {
    console.error('Error picking images:', error);
    return currentImages;
  }
};
