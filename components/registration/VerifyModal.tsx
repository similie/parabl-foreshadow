import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Modal,
  ActivityIndicator,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import { BrandBar, OTPLogin } from "@/components";
import { sendLogin, userRegistrationStore, getUserDetails } from "@/libs";
import { regStyles } from "./RegStyles";
import { OTPValidation } from "@types";
import { XCircleIcon } from "react-native-heroicons/solid";
import { User } from "@/types/context";
interface ChildProps {
  onReady: () => void;
}
const VerifyModal = forwardRef((props: ChildProps, ref) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleBreak, setToggleBreak] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const handleSendOtp = async (username: string) => {
    try {
      setOtpSending(true);
      const login = await sendLogin(username);
      if (!login || !login.id) {
        throw new Error("ID not found");
      }
      setIdentifier(username);
    } catch (e) {
      console.error("Username Login Failure", e);
      Alert.alert("Error", "Failed to login");
    } finally {
      setOtpSending(false);
    }
  };

  const setNext = (valid: OTPValidation) => {
    if (!valid.otp || !valid.user) {
      return Alert.alert("Error", "There was an error processing this request");
    }
    if (valid.token) {
      userRegistrationStore.getState().setAuthToken(valid.token);
    }

    setModalOpen(false);
    props.onReady();
  };

  const resetLocal = async () => {
    const user: User | null = await getUserDetails();
    if (!user) {
      return;
    }

    handleSendOtp(user!.userName);
  };

  const closeModal = () => {
    setToggleBreak(true);
    setModalOpen(false);
  };

  // Expose a method to the parent via the ref
  useImperativeHandle(ref, () => ({
    open: async () => {
      if (modalOpen) {
        return;
      }
      const user = await getUserDetails();
      if (!user) {
        return;
      }
      setToggleBreak(false);
      setModalOpen((prev) => !prev);
      handleSendOtp(user.userName);
    },
    reset: () => {
      setToggleBreak(true);
      setTimeout(async () => {
        setToggleBreak(false);
        await resetLocal();
      }, 500);
    },
  }));

  return (
    <Modal
      visible={modalOpen}
      animationType="slide"
      onRequestClose={() => setModalOpen(false)}
    >
      <View
        className="w-full justify-center mt-auto mb-auto"
        style={regStyles.container}
      >
        {otpSending && <ActivityIndicator size={36} />}
        {!otpSending && (
          <>
            <BrandBar />
            {!toggleBreak && (
              <OTPLogin
                next={setNext}
                identifier={identifier}
                reset={resetLocal}
              />
            )}
          </>
        )}
      </View>
      <View style={regStyles.container}>
        <TouchableOpacity className="absolute bottom-8 " onPress={closeModal}>
          <XCircleIcon color="black" size="36" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
});

export default VerifyModal;
