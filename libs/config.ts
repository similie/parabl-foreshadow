import Constants from "expo-constants";
export const httpServer =
  Constants.expoConfig?.extra?.parablForeshadowApiHost ||
  "https://foreshadow.parabl.io";

export const API_ROUTE = Constants.expoConfig?.extra?.apiBasePath || "/api/v2/";
export const tileServer = `${httpServer}${API_ROUTE}weather`;

export const getApiUrl = (...route: string[]) => {
  const url = `${httpServer}${API_ROUTE}${route.join("/")}`;
  return url;
};
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
