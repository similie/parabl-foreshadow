import React from "react";
import { Text } from "react-native";
import { LatLng } from "react-native-maps";
import { CurrentForecastWeather } from ".";
import { LocationObjectCoords } from "expo-location";
import { LocationPoint } from "@/types/context";
const WeatherDetails: React.FC<{
  coords: LatLng;
  location: LocationPoint | null;
}> = ({ coords, location }) => {
  return (
    <>
      <CurrentForecastWeather
        text="Selected Weather"
        coords={coords as LocationObjectCoords}
        location={location}
      />
    </>
  );
};

export default WeatherDetails;
