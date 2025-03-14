import {
  ForecastAlertsStore,
  LocationContextItems,
  LocationPoint,
  User,
  UserContextItems,
  UserRegistration,
} from "@/types/context";
import { ForecastWarning } from "@types";
import { create } from "zustand";

export const locationPointGlobalStore = create<LocationContextItems>((set) => ({
  locationsList: [],
  setLocationsList: (locationsList: LocationPoint[] = []) =>
    set({ locationsList }),
}));

export const useForecastAlertsStore = create<ForecastAlertsStore>((set) => ({
  alerts: {},
  addAlert: (locationId, alert) =>
    set((state) => {
      const current = state.alerts[locationId] || [];
      return {
        alerts: {
          ...state.alerts,
          [locationId]: [...current, alert],
        },
      };
    }),
  removeAlerts: (locationId) =>
    set((state) => {
      const newAlerts = { ...state.alerts };
      delete newAlerts[locationId];
      return { alerts: newAlerts };
    }),
  clearAlerts: () => set({ alerts: {} }),
}));

export const userGlobalStore = create<UserContextItems>((set) => ({
  user: null,
  token: "",
  setUser: (user: User | null) => set({ user }),
  setToken: (token: string) => set({ token }),
}));

export const userRegistrationStore = create<UserRegistration>((set) => ({
  user: null,
  name: "",
  authToken: "",
  userName: "",
  email: "",
  phone: "",
  avatar: {},
  setUser: (user: User | null) => set({ user }),
  setAuthToken: (authToken: string) => set({ authToken }),
  setUserName: (userName: string) => set({ userName }),
  setAvatar: (avatar: Record<string, string>) => set({ avatar }),
  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
  setPhone: (phone: string) => set({ phone }),
}));
