import { verifyOtp } from "@/libs/otp";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { OTPValidation } from "@types";
import { regStyles } from "./RegStyles";

const OTPLogin: React.FC<{
  identifier: string;
  reset: () => void;
  next: (validation: OTPValidation) => void;
}> = ({ identifier, reset, next }) => {
  const OTP_RESET = 60;
  const [clearOTPReady, setClearOTPReady] = useState(false);
  const [readyCount, setReadyCount] = useState(OTP_RESET);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [otpSending, setOtpSending] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  //   let intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startOTPTimer = () => {
    setClearOTPReady(false);
    const interval = setInterval(() => {
      setReadyCount((prev) => prev - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setClearOTPReady(true);
      setReadyCount(OTP_RESET);
    }, OTP_RESET * 1000);
  };

  const handleBackspace = (text: string, index: number) => {
    // If the text is empty and not the first box, focus on the previous input
    if (text || index < 0) {
      return;
    }
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);
    inputRefs.current[index - 1]?.focus();
  };

  const handleReset = () => {
    setOtp(["", "", "", "", ""]);
    setIsOtpValid(false);
    setClearOTPReady(false);
    reset();
  };

  const handleOtpChange = async (value: string, index: number) => {
    try {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      setOtpSending(false);
      const otpValue = updatedOtp.join("");
      setIsOtpValid(false);
      // Move focus to the next input field
      if (index < otp.length - 1) {
        return value && inputRefs.current[index + 1]?.focus();
      }
      setOtpSending(true);
      const results = await verifyOtp(identifier, otpValue);
      setIsOtpValid(results.otp);
      next(results);
    } catch (e) {
      console.error("Error verifying OTP:", e);
    } finally {
      setOtpSending(false);
    }
  };

  useEffect(() => {
    startOTPTimer();
    return () => {
      // Cleanup the debounce timer on unmount
      console.log("KILLING THE OTP");
    };
  }, []);

  return (
    <>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (isOtpValid) {
                return;
              }

              if (nativeEvent.key === "Backspace") {
                handleBackspace("", index);
              }
            }}
            maxLength={1}
            keyboardType="numeric"
          />
        ))}
      </View>

      {isOtpValid && <Text className="color-green-600 ">OTP is valid!</Text>}

      {!isOtpValid && !otpSending && otp.join("").length === otp.length && (
        <Text className="color-red-600 ">OTP is invalid!</Text>
      )}
      {!otpSending && (
        <TouchableOpacity
          disabled={otpSending || !clearOTPReady}
          style={regStyles.resetButton}
          onPress={handleReset}
        >
          <Text style={regStyles.resetButtonText}>
            Clear OTP {clearOTPReady ? "" : readyCount + "(Seconds)"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default OTPLogin;

const styles = StyleSheet.create({
  otpContainer: { flexDirection: "row", marginBottom: 8 },
  otpInput: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
  },
});
