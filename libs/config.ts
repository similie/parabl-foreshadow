// export const httpServer = "https://f925-185-238-231-55.ngrok-free.app";
export const httpServer = "https://foreshadow.parabl.io"; // "http://localhost:1612";
// export const tileServer = "http://prime.local:5001";
export const API_ROUTE = "/api/v2/";
export const tileServer = `${httpServer}${API_ROUTE}weather`;

export const getApiUrl = (...route: string[]) => {
  return `${httpServer}${API_ROUTE}${route.join("/")}`;
};
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
