import {
  CurrentWeatherType,
  MapLayerItem,
  MapProps,
  PointForecastDetails,
  PointForecastValue,
  RiskIndicator,
  RiskIndicatorMap,
  RiskIndicatorMapValue,
  WeatherType,
  AttentionAlert,
} from "@types";
import axios from "axios";
import { httpServer, tileServer } from "./config";
import { LocationObjectCoords } from "expo-location";
import { userGlobalStore } from "./context";
import { LatLng } from "react-native-maps";
import { convertUtcToLocal } from "./utils";
import { LocationPoint } from "@/types/context";
import { EventEmitter } from "events";
import { StyleProp, TextStyle } from "react-native";
// Create and export a global EventEmitter instance.
export const globalEventEmitter = new EventEmitter();
// You can define event names as constants for reuse:
export const NAVIGATE_TO_GEOPOINT = "navigateToGeopoint";
const MAP_IMAGE_FORMAT = ".png";
const DEFAULT_OPACITY = 0.7;
export const convertToWeatherValues = (weatherValues: PointForecastValue[]) => {
  const weather: CurrentWeatherType = {};

  for (const w of weatherValues) {
    if (!w) {
      continue;
    }
    const meta = w.metadata;
    const key = meta.key;
    weather[key] = {
      value: w.value,
      units: w.units,
      min: meta.minimum,
      max: meta.maximum,
      name: meta.parameterName,
      date: parseWeatherToDate(w),
      risk: w.risk,
    };
  }
  return weather;
};
export const mapLayers: MapLayerItem[] = [
  {
    id: WeatherType.TWO_METER_TEMP,
    label: "Temperature",
    model: "gfs",
    opacity: DEFAULT_OPACITY,
  },
  {
    id: WeatherType.PRECIPITATION_RATE,
    label: "Precipitation",
    model: "gfs",
    opacity: DEFAULT_OPACITY + 0.2,
  },
  {
    id: WeatherType.WIND_SPEED_GUST,
    label: "Wind",
    model: "gfs",
    opacity: DEFAULT_OPACITY,
  },
  {
    id: WeatherType.TWO_METER_REL_HUM,
    label: "Humidity",
    model: "gfs",
    opacity: DEFAULT_OPACITY,
  },
  {
    id: WeatherType.TOTAL_CLOUD_COVER,
    label: "Cloud Cover",
    model: "gfs",
    opacity: DEFAULT_OPACITY,
  },
];

export const riskIndicatorStyle = (
  risk?: Partial<RiskIndicator>,
  minRisk: number = RiskIndicatorMapValue.noThreat,
): StyleProp<TextStyle> => {
  if (!risk) {
    return undefined;
  }

  if ((risk.severityValue || RiskIndicatorMapValue.noThreat) < minRisk) {
    return undefined;
  }

  const { color, severity } = risk;
  if (severity === RiskIndicatorMap.noThreat || !color) {
    return undefined;
  }

  return { color: `${color?.startsWith("#") ? `${color}` : `#${color}`}` };
};

export const buildRiskValue = (
  risk: Partial<RiskIndicator>,
): AttentionAlert => {
  return {
    label: risk.name || "",
    style: riskIndicatorStyle(risk),
    description: risk.description || "",
    severity: risk.severity || RiskIndicatorMap.noThreat,
    color: risk.color || "black",
    onDate: risk.onDate,
  };
};

export const runCoordinates = async (coords: LocationObjectCoords | LatLng) => {
  const token = userGlobalStore.getState().token;
  const results = await getLocationWeather(token, coords);
  return results;
};
export const runCoordinatesForecast = async (
  coords: LocationObjectCoords | LatLng,
): Promise<PointForecastDetails[] | null> => {
  const token = userGlobalStore.getState().token;
  const results = await getCurrentLocationForecast(token, coords);
  return results;
};

export const runCoordinatesWeather = async (
  coords: LocationObjectCoords | LatLng,
): Promise<PointForecastDetails | null> => {
  const token = userGlobalStore.getState().token;
  const results = await getCurrentLocationWeather(token, coords);
  return results;
};

export async function getCurrentLocationForecast(
  token: string,
  coords: LocationObjectCoords | LatLng,
) {
  try {
    const results = await axios.post(`${httpServer}/api/v2/tokens/forecast`, {
      token,
      coords,
    });
    return results.data;
  } catch (error) {
    console.error("Error sending push token to server:", error);
  }
  return null;
}

export async function getCurrentLocationWeather(
  token: string,
  coords: LocationObjectCoords | LatLng,
) {
  try {
    const results = await axios.post(`${httpServer}/api/v2/tokens/weather`, {
      token,
      coords,
    });
    return results.data;
  } catch (error) {
    console.error("Error sending push token to server:", error);
  }
  return null;
}

export async function getLocationWeatherPoints(): Promise<LocationPoint[]> {
  const token = userGlobalStore.getState().token;
  try {
    const results = await axios.get(
      `${httpServer}/api/v2/tokens?token=${token}`,
    );
    return results.data as LocationPoint[];
  } catch (error) {
    console.error("Error sending push token to server:", error);
  }
  return [];
}

export async function deleteLocationWeather(location: LocationPoint) {
  try {
    const results = await axios.delete(
      `${httpServer}/api/v2/tokens/${location.id}`,
    );
    return results.data;
  } catch (error) {
    console.error("Error sending push token to server:", error);
  }
  return null;
}

export async function createLocationWeather(
  user: string,
  name: string,
  coords: LocationObjectCoords | LatLng,
) {
  try {
    const results = await axios.post(`${httpServer}/api/v2/tokens`, {
      user,
      name,
      latitude: coords?.latitude || 0,
      longitude: coords?.longitude || 0,
    });
    return results.data;
  } catch (error) {
    console.error("Error sending push token to server:", error);
  }
  return null;
}

export async function getLocationName(coords: LocationObjectCoords | LatLng) {
  try {
    const results = await axios.post(`${httpServer}/api/v2/tokens/name`, {
      latitude: coords?.latitude || 0,
      longitude: coords?.longitude || 0,
    });
    return results.data;
  } catch (error) {
    console.error("Error sending push token to server:", error);
  }
  return null;
}

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

export const WeatherMapProps: Partial<
  Record<WeatherType, Record<string, any>>
> = {
  [WeatherType.TWO_METER_TEMP]: {
    typeOfLevel: "heightAboveGround",
    level: 2,
    stepType: "instant",
  },
  [WeatherType.TWO_METER_REL_HUM]: {
    typeOfLevel: "heightAboveGround",
    level: 2,
    stepType: "instant",
  },
  [WeatherType.TOTAL_CLOUD_COVER]: {
    level: 0,
    stepType: "avg",
    typeOfLevel: "atmosphere",
  },
  [WeatherType.PRECIPITATION_RATE]: {
    stepType: "accum",
    typeOfLevel: "surface",
    level: 0,
  },
  [WeatherType.WIND_SPEED_GUST]: {
    stepType: "instant",
    typeOfLevel: "surface",
    level: 0,
  },
};

export const getMappingLayer = (
  model: string,
  field: WeatherType = WeatherType.TWO_METER_TEMP,
  time = 0,
) => {
  const token = userGlobalStore.getState().token;
  const props = WeatherMapProps[field];
  const params = new URLSearchParams();
  params.set("authorization", token);
  if (props) {
    for (const key in props) {
      params.append(key, props[key]);
    }
  }

  const outUrl = `${tileServer}/tiles/${model}/${field}/${time}/{z}/{x}/{y}${MAP_IMAGE_FORMAT}?${
    params.toString() || ""
  }`;
  return outUrl;
};

export const buildLayerItem = (layer: MapLayerItem) => {
  /**
   * I want to select layer.id if it is type MayLayerItem or layer.layer if it is from MapProps
   */

  return `${layer.model}/${layer.id}`;
};

export const buildLayerItemProps = (layer: MapProps) => {
  /**
   * I want to select layer.id if it is type MayLayerItem or layer.layer if it is from MapProps
   */

  return `${layer.model}/${layer.layer}`;
};

export const AnimationConstants = {
  HOUR_RANGE: 5, // We load 0..5
  ANIMATION_INTERVAL_MS: 50, // ~20 fps
  STEPS: 20,
  DEFAULT_OPACITY: 0.7,
  OFF: true,
};

export const parseWeatherToDate = (weather: PointForecastValue) => {
  const meta = weather.metadata;
  const dataDate = meta.dataDate.toString(); // Example: 2025-01-23
  const year = parseInt(dataDate.substring(0, 4));
  const month = parseInt(dataDate.substring(4, 6)) - 1; // Months are 0-based in JavaScript
  const day = parseInt(dataDate.substring(6, 8));
  const dataTime = meta.dataTime.toString();
  const hours = parseInt(dataTime.substring(0, 1)); // For "600", this will be 6
  const minutes = parseInt(dataTime.substring(2, 4) || "0"); // For "600", this will be 0
  // Create a Date object in local time
  const localDate = new Date(year, month, day, hours, minutes);

  // Convert to UTC timestamp (milliseconds since epoch)
  let utcTimestamp = localDate.getTime();
  utcTimestamp += meta.forecastTime * 60 * 60 * 1000;
  try {
    const localDateTime = convertUtcToLocal(utcTimestamp);
    return new Date(localDateTime);
  } catch (e) {
    console.error("ERROR PARSING DATE", e);
  }
  return new Date();
};
