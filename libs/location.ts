import { ObjectLocation, MapboxView } from "@types";
import * as Location from "expo-location";

// export async function trackUserLocation(map: MapboxView) {
//   await enableLocationRequest(true);

//   watchLocation(
//     (location: Location) => {
//       location.latitude;
//       const options = {
//         lat: location.latitude,
//         lng: location.longitude,
//       };
//       //   map.setCenter([location.longitude, location.latitude]);
//       map.setCenter(options);
//     },
//     (error) => {
//       console.error("Location tracking failed:", error);
//     },
//     { updateDistance: 10 }, // Update when user moves 10 meters
//   );
// }

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
