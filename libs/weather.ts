import { MapboxView, WeatherLayer, WeatherType } from "@types";
import Mapbox, { MapView } from "@rnmapbox/maps";
import { timestamp } from "./utils";

import axios from "axios";
import { httpServer } from "./config";
import { LocationObjectCoords } from "expo-location";
import { userGlobalStore } from "./context";
import { LatLng } from "react-native-maps";

export const TOMORROW_API_KEY = "***REMOVED***";
export const MAPBOX_ACCESS_KEY =
  "***REMOVED***Zcphw";
const MAP_IMAGE_FORMAT = ".png";

export const weatherLayers: WeatherLayer[] = [
  { id: WeatherType.TEMP, name: "Temperature" },
  { id: WeatherType.PRECIPITATION_PROBABILITY, name: "Precipitation" },
  { id: WeatherType.WIND_SPEED, name: "Wind Speed" },
  // Add more layers as needed
];

export const runCoordinates = async (coords: LocationObjectCoords | LatLng) => {
  const token = userGlobalStore.getState().token;
  const results = await getLocationWeather(token, coords);
  console.log("Weather Results:", results);
  return results;
};

export async function getLocationWeather(
  token: string,
  coords: LocationObjectCoords | LatLng,
) {
  try {
    const results = await axios.post(`${httpServer}/api/v2/tokens/point`, {
      token,
      coords,
    });
    return results.data;
  } catch (error) {
    console.error("Error sending push token to server:", error);
  }
  return null;
}

// export async function fetchWeatherData(location: Location) {
//   const url = `https://api.tomorrow.io/v4/timelines?location=${location.latitude},${location.longitude}&fields=temperature,precipitationIntensity&timesteps=1h&units=metric&apikey=${TOMORROW_API_KEY}`;

//   try {
//     const response: any = await Http.getJSON(url);
//     return response.data.timelines[0].intervals;
//   } catch (error) {
//     console.error("Error fetching weather data:", error);
//     return [];
//   }
// }

// export const addWeatherOverlay = async (
//   map: typeof Mapbox,
//   weatherType: WeatherType,
// ) => {
//   const tomorrowTileUrl = getTomorrowMap(weatherType);

//   await map.addSource("weather-tiles", {
//     type: "raster",
//     tiles: [tomorrowTileUrl],
//     tileSize: 256, // Tile size in pixels
//   });

//   await map.addLayer({
//     id: "weather-layer",
//     type: "raster",
//     source: "weather-tiles",
//     paint: {
//       "raster-opacity": 0.7, // Adjust the transparency
//     },
//     minzoom: 1,
//     maxzoom: 12,
//   });
// };

export const getMappingLayer = (
  field: WeatherType = WeatherType.TEMP,
  time = 0,
  startTime = new Date(),
) => {
  // return `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/${field}/${timestamp(
  //   time,
  //   startTime,
  // )}${MAP_IMAGE_FORMAT}?apikey=${TOMORROW_API_KEY}`;

  return `http://localhost:5001/tiles/boomo/{z}/{x}/{y}.png`;
};
