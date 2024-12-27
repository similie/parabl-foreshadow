import { RegStepper, RouteHome } from "@components";
import React from "react";
import { View, StyleSheet } from "react-native";

const RegistrationStepper: React.FC = () => {
  return (
    <View style={styles.container}>
      <RegStepper />
      <RouteHome className="absolute bottom-8" />
    </View>
  );
};

export default RegistrationStepper;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexGrow: 1,
  },
});
