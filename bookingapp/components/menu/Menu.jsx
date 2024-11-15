import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo } from "@expo/vector-icons";

const Menu = ({ items, title, onItemSelect,restaurant }) => {
  const navigation = useNavigation();

  return (
    <View className="flex p-6 bg-white">
      {/* <Text className="text-lg font-semibold">Đề xuất</Text> */}
      <Text className="text-lg font-semibold mt-2">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <View key={index}>
            <TouchableOpacity onPress={() => navigation.navigate("FoodDetail", { item, restaurant })}>
              <View className="flex flex-row pb-4 border-b-[1px] border-b-[#B7B7B7] w-[100%] mt-2 mr-4">
                <View className="mr-2">
                  <Image
                    style={{ width: 110, height: 110, borderRadius: 8 }}
                    source={{
                      uri: item.image,
                    }}
                  />
                  <View className="mt-2">
                    <TouchableOpacity>
                      <Text className="text-center p-1 border-[#BF3431] border rounded-sm text-[#BF3431]">
                        bán chạy
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="w-60">
                  <Text className="text-lg font-bold mt-1.5">{item.title}</Text>
                  <Text className="mt-1.5 text-gray-500">{item.subTitle}</Text>
                  <Text className="mt-1.5 text-[#E15241] font-normal text-base">
                    {item.originalPrice}
                  </Text>
                  <Text>{item.highLight}</Text>
                  <Text className="text-sky-500 underline">
                    Quy định & điều kiện sử dụng sản phẩm này
                  </Text>
                  <View className="mt-2 ">
                    <TouchableOpacity onPress={() => onItemSelect(item)}>
                      <Text className="w-full text-center p-1 border-[#9A9A9A] border rounded-sm text-[#313131]">
                        Select now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Menu;