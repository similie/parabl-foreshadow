import Constants from "expo-constants";
export const httpServer =
  Constants.expoConfig?.extra?.parablForeshadowApiHost ||
  "https://foreshadow.parabl.io"; // "http://localhost:1612";
// export const tileServer = "http://prime.local:5001";
export const API_ROUTE = Constants.expoConfig?.extra?.apiBasePath || "/api/v2/";
export const tileServer = `${httpServer}${API_ROUTE}weather`;

export const getApiUrl = (...route: string[]) => {
  return `${httpServer}${API_ROUTE}${route.join("/")}`;
};
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
