import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import PopUp from "@/components/menu/Popup";
import Colors from "@/constants/Colors";
const FilterScreen: React.FC = () => {
  const handleApply = (item: any) => {
    console.log("Applied with item:", item);
    // Perform additional actions here
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>Ngành hàng</Text>
        <Text style={[styles.tag, styles.customWidth, styles.customStyles]}>
          Nhà hàng
        </Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <FilterCategory title="Giá Trung bình">
          <Text style={styles.tag}>150k</Text>
          <Text style={styles.tag}>150k-250k</Text>
          <Text style={styles.tag}>250k-500k</Text>
          <Text style={[styles.tag, styles.red]}>500k-1000k</Text>
          <Text style={styles.tag}>1000k</Text>
        </FilterCategory>

        <FilterCategory title="Khoảng cách">
          <Text style={[styles.tag, styles.red]}>{'<'}500m</Text>
          <Text style={styles.tag}>500m-1km</Text>
          <Text style={styles.tag}>1km-5km</Text>
          <Text style={styles.tag}>{'>'}5km</Text>
        </FilterCategory>

        <FilterCategory title="Loại hình">
          <Text style={styles.tag}>Món miền Bắc</Text>
          <Text style={[styles.tag, styles.red]}>Món miền Trung</Text>
          <Text style={styles.tag}>Món miền Nam</Text>
          <Text style={styles.tag}>Món miền Tây</Text>
          <Text style={styles.tag}>Món Nhật-Hàn</Text>
          <Text style={styles.tag}>Món Âu</Text>
          <Text style={styles.tag}>Món Thái</Text>
          <MoreButton />
        </FilterCategory>

        <FilterCategory title="Đặt tiệc công ty">
          <Text style={styles.tag}>Tiệc công ty dưới 20 người</Text>
          <Text style={styles.tag}>Tiệc công ty 20-35 người</Text>
          <Text style={styles.tag}>Tiệc công ty 35-50 người</Text>
          <Text style={styles.tag}>Tiệc công ty 50-100 người</Text>
          <Text style={styles.tag}>Tiệc công ty 100 người trở lên</Text>
          <Text style={styles.tag}>Tiệc công ty Quận Phú Nhuận</Text>
          <MoreButton />
        </FilterCategory>
      </ScrollView>
      <PopUp buttonText="Áp dụng" onPress={handleApply} />
    </View>
  );
};

const FilterCategory: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View>
    <Text style={styles.headerText}>{title}</Text>
    <View style={styles.tagContainer}>{children}</View>
  </View>
);

const MoreButton: React.FC = () => (
  <View style={[styles.tag, styles.more]}>
    <Feather name="more-horizontal" size={24} color={Colors.primary} />
    <Text style={styles.moreText}>Xem thêm</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  } as ViewStyle,
  scrollView: {
    marginTop: 8,
    backgroundColor: "#ffffff",
  } as ViewStyle,
  headerText: {
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginTop: 16,
    paddingHorizontal: 16,
  } as TextStyle,
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingHorizontal: 16,
  } as ViewStyle,
  tag: {
    backgroundColor: "#F3F2F8",
    color: "#000005",
    borderRadius: 3,
    marginLeft: 16,
    padding: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 17,
    borderColor: "#ADACB1",
    borderWidth: 1,
  } as TextStyle,
  red: {
    backgroundColor: Colors.primary,
    color: "#FFFFFF",
  } as TextStyle,
  customWidth: {
    width: 100,
  } as TextStyle,
  customStyles: {
    backgroundColor: Colors.primary,
    color: "white",
  } as TextStyle,
  more: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  moreText: {
    marginLeft: 8,
    color: "#C72A35",
    fontSize: 16,
  } as TextStyle,
});

export default FilterScreen;
