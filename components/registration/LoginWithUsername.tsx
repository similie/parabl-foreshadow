import { TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { regStyles } from "./RegStyles";
import { useState } from "react";
import { sendLogin, storeUserDetails } from "@libs";
import OTPLogin from "./OTPLogin";
import { OTPValidation } from "@types";
import React from "react";

const UsernameLogin: React.FC<{ onNext: (ready: boolean) => void }> = ({
  onNext,
}) => {
  const [userName, setUserName] = useState("");
  const [optSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const handleSendOtp = async () => {
    try {
      setOtpSending(true);
      const login = await sendLogin(userName);
      if (!login || !login.id) {
        throw new Error("ID not found");
      }
      setIdentifier(userName);
      setOtpSent(true);
    } catch (e) {
      console.error("Username Login Failure", e);
      Alert.alert("Error", "Failed to login");
    } finally {
      setOtpSending(false);
    }
  };

  const reset = () => {
    setOtpSent(false);
    setIdentifier("");
    setUserName("");
  };

  const setNext = async (validation: OTPValidation) => {
    if (!validation.otp) {
      return console.error("OTP not found");
    }
    if (!validation.user) {
      return onNext(false);
    }

    await storeUserDetails(validation.user);
    onNext(true);
  };

  return (
    <>
      {!optSent ? (
        <>
          <TextInput
            style={regStyles.inputBorderless}
            placeholder="Username"
            keyboardType="default"
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
            className={"border border-gray-300 bg-slate-50 w-full"}
          />
          <TouchableOpacity
            style={regStyles.button}
            disabled={otpSending || !userName}
            onPress={handleSendOtp}
          >
            <Text style={regStyles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      ) : (
        <OTPLogin next={setNext} identifier={identifier} reset={reset} />
      )}
    </>
  );
};

export default UsernameLogin;
