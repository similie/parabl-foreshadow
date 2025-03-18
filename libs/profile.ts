import axios from "axios";
import { getApiUrl } from "./config";
import { userGlobalStore, userRegistrationStore } from "./context";
import { User } from "@/types/context";
import { verifyOTPValidity } from "./otp";

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function licenseAgreement(): Promise<string> {
  const results = await axios.get(getApiUrl("appusers", "license"));
  const license = results.data || {};
  return license.text || "";
}

export async function assignUserToToken() {
  const user = userGlobalStore.getState().user;
  const token = userGlobalStore.getState().token;
  if (!user || !token) {
    throw new Error("We need both a user and a token in session");
  }
  const results = await axios.post(getApiUrl("appusers", "assign"), {
    token: token,
    user: user.id,
  });

  verifyOTPValidity(results);
  return results.data;
}

export async function registerUser(): Promise<User> {
  const state = userRegistrationStore.getState();
  const results = await axios.post(
    getApiUrl("appusers"),
    {
      name: state.name,
      email: state.email,
      userName: state.userName,
      phone: state.phone,
      avatar: state.avatar,
    },
    {
      headers: {
        Authorization: state.authToken,
      },
    },
  );

  verifyOTPValidity(results);
  return results.data;
}

export async function updateUser(id: string, params: Partial<User>) {
  const token = userRegistrationStore.getState().authToken;
  const results = await axios.put(getApiUrl("appusers", id), params, {
    headers: {
      Authorization: token,
    },
  });

  verifyOTPValidity(results);
  return results.data;
}

export async function registeredUser(params: Partial<User>) {
  const token = userRegistrationStore.getState().authToken;
  const results = await axios.post(
    getApiUrl("appusers", "registered"),
    params,
    {
      headers: {
        Authorization: token,
      },
    },
  );

  verifyOTPValidity(results);
  return results.data;
}
export const logoutUser = () => {
  userGlobalStore.getState().setUser(null);
  return AsyncStorage.removeItem("@user");
};

export const storeUserDetails = async (user: User) => {
  try {
    // userGlobalStore((state) => state.setUser(user));
    userGlobalStore.getState().setUser(user);
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem("@user", jsonValue);
  } catch (e) {
    console.error("Error saving user data:", e);
  }
};

export const getUserDetails = async (): Promise<User | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem("@user");
    const user = jsonValue != null ? JSON.parse(jsonValue) : null;
    // userGlobalStore((state) => state.setUser(user));
    if (user && !userGlobalStore.getState().user) {
      userGlobalStore.getState().setUser(user);
    }

    return user;
  } catch (e) {
    console.error("Error retrieving user data:", e);
  }
  return null;
};

export const sendLogin = async (
  userName: string,
  checkPhone: boolean = false,
): Promise<{ identifier: string; id: string } | null> => {
  const token = userGlobalStore.getState().token;
  const results = await axios.post(getApiUrl("appusers", "login"), {
    token,
    userName,
    checkPhone,
  });

  verifyOTPValidity(results);
  return results.data;
};
