import { View, Text } from "react-native";
import LogoIcon from "./LogoIcon";
import React from "react";

const BrandBar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <View
      className={className || "" + " flex w-full items-center justify-center"}
    >
      <>
        <LogoIcon />
        <Text>Parabl</Text>
      </>
    </View>
  );
};

export default BrandBar;
