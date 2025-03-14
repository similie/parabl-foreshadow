import { AttentionAlert, ForecastWarning, RiskIndicator } from "./weather";

export type User = {
  id: string;
  userName: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: Record<string, string>;
};

export interface UserContextItems {
  user: User | null;
  token: string;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
}

export interface ForecastAlertsStore {
  alerts: Record<string, ForecastWarning[]>;
  addAlert: (locationId: string, alert: ForecastWarning) => void;
  removeAlerts: (locationId: string) => void;
  clearAlerts: () => void;
}

export interface LocationPoint {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  user: string;
  alerts?: RiskIndicator[];
}

export interface LocationContextItems {
  locationsList: LocationPoint[];
  setLocationsList: (locationsList?: LocationPoint[]) => void;
}

export interface UserRegistration {
  user: User | null;
  name: string;
  userName: string;
  email: string;
  phone?: string;
  authToken: string;
  avatar?: Record<string, string>;
  setUser: (user: User | null) => void;
  setAuthToken: (authToken: string) => void;
  setUserName: (userName: string) => void;
  setAvatar: (avatar: Record<string, string>) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
}
