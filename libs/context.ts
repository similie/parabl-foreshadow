import { User, UserContextItems, UserRegistration } from "@/types/context";
import { create } from "zustand";

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
