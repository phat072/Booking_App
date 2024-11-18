import React from "react";
import { View, Text, StyleSheet, Image, SectionList } from "react-native";

const SectionListComponent = ({ SECTIONS, renderTab }: any) => {
  const renderSectionHeader = ({ section }: any) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const renderItem = ({ item, section }: any) => {
    if (section.title === "Đề xuất") {
      if (item.type === "menu") {
        return (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item.price}</Text>
          </View>
        );
      }
    }
    return <Image source={{ uri: item.image }} style={styles.image} />;
  };

  return (
    <SectionList
      sections={SECTIONS}
      keyExtractor={(item: any, index: any) => item + index}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 8,
  },
  item: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 200,
  },
});

export default SectionListComponent;
