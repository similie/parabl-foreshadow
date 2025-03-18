import axios, { type AxiosResponse } from "axios";
import { getApiUrl } from "./config";
import { userGlobalStore } from "./context";
// import { User } from "@/types/context";
import { OTPValidation } from "@types";

export const verifyOTPValidity = (results: AxiosResponse) => {
  if (results.status === 200) {
    return;
  }
  if (results.status === 401) {
    throw new Error("OTP Session Expired");
  }
  throw new Error("Unknown Error");
};

export async function generateOtp(identifier: string) {
  try {
    const token = userGlobalStore.getState().token;
    const results = await axios.post(getApiUrl("otp"), {
      token,
      identifier,
    });
    return results.data;
  } catch (error) {
    console.error("Error sending push token to server:", error);
  }
  return null;
}

export async function verifyOtp(
  identifier: string,
  otpValue: string,
): Promise<OTPValidation> {
  const token = userGlobalStore.getState().token;
  const results = await axios.post(getApiUrl("otp", "verify"), {
    token,
    identifier,
    otp: otpValue,
  });
  verifyOTPValidity(results);
  return results.data;
}
