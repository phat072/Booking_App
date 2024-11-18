import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import MenuLayout2 from "@/components/menu/MenuLayout2";

import { StackStackParamList } from "../type";

type ListMenuResRouteProp = RouteProp<StackStackParamList, "ListMenuRes">;

const ListMenuRes: React.FC = () => {
  const { params } = useRoute<ListMenuResRouteProp>();
  if (!params) {
    return null;
  }
  const { restaurant } = params;

  return (
    <View style={styles.container}>
      <MenuLayout2 restaurant={restaurant} />
    </View>
  );
};

export default ListMenuRes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
