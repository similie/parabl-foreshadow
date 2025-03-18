import * as Location from "expo-location";

export type ObjectLocation = Location.LocationObject;
export interface SelectedAddress {
  name: string;
  latitude: number;
  longitude: number;
}
