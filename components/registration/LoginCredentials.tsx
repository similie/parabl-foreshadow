import { userRegistrationStore } from "@/libs/context";
import { generateOtp } from "@/libs/otp";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { emailRegex, phoneRegex } from "@libs";
import OTPLogin from "./OTPLogin";
import { OTPValidation } from "@types";
import { regStyles } from "./RegStyles";
const LoginCredentials: React.FC<{
  onNext: (
    results: OTPValidation,
    identifier: string,
    isUsingEmail: boolean,
  ) => void;
  onIdentifierChange: (identifier: string, isUsingEmail: boolean) => void;
}> = ({ onNext, onIdentifierChange }) => {
  const [isUsingEmail, setIsUsingEmail] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [identifier, setLocalIdentifier] = useState<string>("");

  const getIdentifier = () => {
    if (isUsingEmail && !emailRegex.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    if (!isUsingEmail && !phoneRegex.test(phone)) {
      throw new Error(
        "Please enter a valid international phone number (e.g., +1234567890).",
      );
    }
    return isUsingEmail ? email : phone;
  };

  const handleSendOtp = async () => {
    setOtpSending(true);
    try {
      const identifier = getIdentifier();
      setLocalIdentifier(identifier);
      await generateOtp(identifier);
      setOtpSent(true);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    setOtpSending(false);
  };
  const setNext = (results: OTPValidation) => {
    if (results.token) {
      userRegistrationStore.getState().setAuthToken(results.token);
    }
    setOtpSending(false);
    onNext(results, identifier, isUsingEmail);
  };

  const handleReset = () => {
    setOtpSent(false);
    setEmail("");
    setPhone("");
  };

  const toggleMethod = () => {
    const toggle = !isUsingEmail;
    setIsUsingEmail(toggle);
    onIdentifierChange("", toggle);
    handleReset(); // Reset when toggling methods
  };

  return (
    <>
      {/* Toggle Between Email and Phone */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleMethod}>
        <Text style={styles.toggleButtonText}>
          Use {isUsingEmail ? "Phone Number" : "Email"} Instead
        </Text>
      </TouchableOpacity>

      {/* Input for Email or Phone */}
      {isUsingEmail ? (
        <TextInput
          style={regStyles.inputBorderless}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          editable={!otpSent}
          className={!otpSent ? "border border-gray-300 bg-slate-50" : ""}
        />
      ) : (
        <TextInput
          style={regStyles.inputBorderless}
          placeholder="Phone Number (e.g., +1234567890)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          className={!otpSent ? "border border-gray-300 bg-slate-50" : ""}
          editable={!otpSent}
        />
      )}

      {otpSent && (
        <OTPLogin identifier={identifier} next={setNext} reset={handleReset} />
      )}

      {!otpSent && (
        <TouchableOpacity
          style={regStyles.button}
          disabled={otpSending}
          onPress={handleSendOtp}
        >
          <Text style={regStyles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default LoginCredentials;

const styles = StyleSheet.create({
  toggleButton: {
    marginBottom: 10,
  },
  toggleButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
