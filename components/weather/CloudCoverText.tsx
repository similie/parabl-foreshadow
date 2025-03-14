// import { getGrayScaleHex } from "@libs";
import React from "react";
import { Text, View } from "react-native";

const CloudCoverText: React.FC<{ cloudCover: number; className?: string }> = ({
  cloudCover,
  className,
}) => {
  // const coverage = getGrayScaleHex(cloudCover);
  return (
    <View className={className}>
      {cloudCover <= 20 && <Text style={{ color: "#333" }}>Clear</Text>}
      {cloudCover > 20 && cloudCover <= 50 && (
        <Text style={{ color: "#666" }}>Mostly Clear</Text>
      )}
      {cloudCover > 50 && cloudCover <= 80 && (
        <Text style={{ color: "#999" }}>Partly Cloudy</Text>
      )}
      {cloudCover > 80 && <Text style={{ color: "#ccc" }}>Cloudy</Text>}
    </View>
  );
};

export default CloudCoverText;
