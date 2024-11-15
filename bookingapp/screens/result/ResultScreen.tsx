import React from "react";
import { View } from "react-native";
import ResHor from "../../components/result/ResHor";
import { RouteProp } from "@react-navigation/native";

type ResultScreenProps = {
  route: RouteProp<any, any>;
};

const ResultScreen: React.FC<ResultScreenProps> = ({ route }) => {
  return (
    <View>
      <ResHor route={route} />
    </View>
  );
};

export default ResultScreen;
