import React, { useLayoutEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import HeaderComponent from "@/components/sheet/HeaderComponent";
import ImageComponent from "@/components/sheet/ImageComponent";
import InfoComponent from "@/components/sheet/InfoComponent";
import SectionListComponent from "@/components/sheet/SectionListComponent";

const BottomSheetTest = ({ navigation }: any) => {
  const scrollRef = useAnimatedRef();
  const scrollOffset = useSharedValue(0);
  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
    translateY.value = Math.min(event.contentOffset.y, 250);
  });

  const headerAnimatedStyle = {
    opacity: translateY.value / 250,
  };

  const imageAnimatedStyle = {
    transform: [{ translateY: -translateY.value }],
  };

  const SECTIONS = [
    {
      title: "Đề xuất",
      data: [
        {
          type: "menu",
          title: "Suất Buffet Trưa T2-T6 - D'Maris Lotte Mart Quận 7",
          description:
            "Gồm: Cá hồi xông khói, Pasta, Steak, Hải sản, Sushi, Sashimi, Salad, Bakery",
          price: "428K",
          discount: "-10%",
          originalPrice: "476K",
          image: "link_to_image_1", // Thay bằng đường dẫn thực tế của hình ảnh
        },
        {
          type: "text",
          text: "I. Đặt chỗ PasGo: Tư vấn - Giữ chỗ\n- Khách hàng cần đặt bàn ít nhất là 60 phút trước giờ đến nhà hàng.\n- Nhà hàng chỉ giữ bàn sau 15 phút.\n- Nhà hàng chỉ nhận bàn đặt trước từ 20 khách trở lên\nII. Ưu đãi tặng kèm: Chương trình ưu đãi, khuyến mại đang được xây dựng\nIII. Lưu ý\n- Nhà hàng chỉ nhận bàn đặt trước từ 20 khách trở lên\n- Giá Buffet chưa bao gồm VAT, phí phục vụ và khăn lạnh. Nhà hàng luôn thu VAT theo Quy định hiện hành và 5% phí phục vụ.\n- Ưu đãi không áp dụng các ngày: Tháng 1 (Ngày 1); Tháng 2 (Ngày 14); Tháng 3 (Ngày 8); Tháng 4 (Ngày 30); Tháng 5 (Ngày 1); Tháng 6 (Ngày 1); Tháng 9 (Ngày 2); Tháng 10 (Ngày 20); Tháng 11 (Ngày 20); Tháng 12 (Ngày 24, 25, 31) & 10/3 Âm Lịch\n- Nhà hàng quy định không mang thức ăn, thức uống từ bên ngoài vào\n- Từ 10 người trở lên đặt món trước, vui lòng đặt cọc trước với Nhà hàng",
        },
      ],
    },
    {
      title: "Tóm tắt",
      data: [
        {
          type: "summary",
          description:
            "D'Maris Lotte Mart Quận 7 là nhà hàng buffet nổi tiếng với hơn 200 món ăn đến từ Hàn Quốc, Nhật Bản, Trung Quốc và Việt Nam. Nhà hàng không chỉ có các món ăn ngon mà còn có không gian sang trọng, thích hợp cho các buổi tiệc gia đình, gặp gỡ bạn bè và các sự kiện đặc biệt.",
          featuredDishes: [
            "Cá hồi xông khói",
            "Pasta",
            "Steak",
            "Hải sản",
            "Sushi",
            "Sashimi",
          ],
        },
      ],
    },
    {
        title: "Bảng giá",
        data: [
          { image: "link_to_image_2" }, // Thay bằng đường dẫn thực tế của hình ảnh
          { image: "link_to_image_3" },
          { image: "link_to_image_4" },
        ],
      },
      {
        title: "Quy định",
        data: [
          {
            type: "rules",
            text: "I. Đặt chỗ PasGo: Tư vấn - Giữ chỗ\n- Khách hàng cần đặt bàn ít nhất là 60 phút trước giờ đến nhà hàng.\n- Nhà hàng chỉ giữ bàn sau 15 phút.\n- Nhà hàng chỉ nhận bàn đặt trước từ 20 khách trở lên\nII. Ưu đãi tặng kèm: Chương trình ưu đãi, khuyến mại đang được xây dựng\nIII. Lưu ý\n- Nhà hàng chỉ nhận bàn đặt trước từ 20 khách trở lên\n- Giá Buffet chưa bao gồm VAT, phí phục vụ và khăn lạnh. Nhà hàng luôn thu VAT theo Quy định hiện hành và 5% phí phục vụ.\n- Ưu đãi không áp dụng các ngày: Tháng 1 (Ngày 1); Tháng 2 (Ngày 14); Tháng 3 (Ngày 8); Tháng 4 (Ngày 30); Tháng 5 (Ngày 1); Tháng 6 (Ngày 1); Tháng 9 (Ngày 2); Tháng 10 (Ngày 20); Tháng 11 (Ngày 20); Tháng 12 (Ngày 24, 25, 31) & 10/3 Âm Lịch\n- Nhà hàng quy định không mang thức ăn, thức uống từ bên ngoài vào\n- Từ 10 người trở lên đặt món trước, vui lòng đặt cọc trước với Nhà hàng",
          },
        ],
      },
    ];

  const renderTab = ({ title, isActive }: any) => (
    <Text style={{ color: isActive ? "blue" : "black" }}>{title}</Text>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
    });
  }, []);

  return (
    <View style={styles.container}>
      <HeaderComponent
        navigation={navigation}
        headerAnimatedStyle={headerAnimatedStyle}
      />
      <Animated.ScrollView
        ref={scrollRef as any}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <ImageComponent imageAnimatedStyle={imageAnimatedStyle} />
        <InfoComponent />
        <SectionListComponent SECTIONS={SECTIONS} renderTab={renderTab} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default BottomSheetTest;
