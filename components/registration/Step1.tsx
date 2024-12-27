import { userGlobalStore, userRegistrationStore } from "@/libs/context";
import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { router } from "expo-router";
import { User } from "@/types/context";
import { assignUserToToken, storeUserDetails } from "@libs";
import { OTPValidation } from "@types";
import { regStyles } from "./RegStyles";
import LoginCredentials from "./LoginCredentials";
const Step1: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [isUsingEmail, setIsUsingEmail] = useState(true);
  const setIdentifier = (identifier: string, isUsingEmail: boolean) => {
    isUsingEmail
      ? userRegistrationStore.getState().setEmail(identifier)
      : userRegistrationStore.getState().setPhone(identifier);
    return true;
  };

  const handleNext = (verified: boolean) => {
    if (!verified) {
      return Alert.alert("Error", "Invalid OTP.");
    }
    onNext();
  };

  const alreadyHaveAccount = async (user: User) => {
    userGlobalStore.getState().setUser(user);
    Alert.alert("Success", "You are already registered.");
    await assignUserToToken();
    await storeUserDetails(user);
    router.push("/");
  };

  const setNext = (
    results: OTPValidation,
    identifier: string,
    isUsingEmail: boolean,
  ) => {
    const verified = results.otp;
    if (results.user) {
      return alreadyHaveAccount(results.user);
    }
    verified && setIdentifier(identifier, isUsingEmail) && handleNext(verified);
  };

  const onIdentifierChange = (identifier: string, isUsingEmail: boolean) => {
    setIdentifier(identifier, isUsingEmail);
    setIsUsingEmail(isUsingEmail);
  };

  return (
    <View style={regStyles.container}>
      <Text style={regStyles.title}>
        Step 1: Verify {isUsingEmail ? "Email" : "Phone"}
      </Text>
      <LoginCredentials
        onNext={setNext}
        onIdentifierChange={onIdentifierChange}
      />
    </View>
  );
};

export default Step1;
