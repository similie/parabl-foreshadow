import { ObjectLocation } from "@types";
import * as Location from "expo-location";

export async function getUserLocation(): Promise<ObjectLocation> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    let currentLocation = await Location.getCurrentPositionAsync({});

    return currentLocation;
  } catch (error) {
    console.error("Error getting location:", error);
    throw error;
  }
}
