import React, { useState } from "react";
import { router } from "expo-router";
import { View, StyleSheet, Alert } from "react-native";
import { LoginWithUsername, BrandBar, RouteHome } from "@components";

export default function LoginScreen() {
  const routeHome = () => {
    router.push("/");
  };

  const setNext = async (results: boolean) => {
    if (!results) {
      return;
    }
    Alert.alert("Success", "Login Successful");
    routeHome();
  };

  return (
    <View className="w-full flex-col" style={styles.container}>
      <BrandBar className="mb-4" />
      <LoginWithUsername onNext={setNext} />
      <RouteHome className="absolute bottom-8" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexGrow: 1,
  },
});
