import { StyleProp, TextStyle } from "react-native";
import { LocationPoint } from "./context";

export enum WeatherType {
  TOTAL_CLOUD_COVER = "total-cloud-cover",
  TWO_METER_TEMP = "2-metre-temperature",
  TWO_METER_REL_HUM = "2-metre-relative-humidity",
  PRECIPITATION_RATE = "total-precipitation",
  WIND_SPEED_GUST = "wind-speed-gust",
}

export enum RiskColorMap {
  noThreat = "#000000", // yellow
  vLow = "#1DE28D", // lighter yellow EAFB04
  low = "#D4E21D",
  moderate = "#E28D1D", // orange
  high = "#E21D1D", // red
  vHigh = "#E21D72",
}

export enum RiskIndicatorMap {
  noThreat = "Non-Threatening", // yellow
  vLow = "Very Low", // lighter yellow EAFB04
  low = "Low",
  moderate = "Moderate", // orange
  high = "High", // red
  vHigh = "Extreme",
}

export enum RiskIndicatorMapValue {
  noThreat,
  vLow,
  low,
  moderate,
  high,
  vHigh,
}

export type WeatherLayer = {
  id: WeatherType;
  name?: string;
};

export type WeatherValuesMap = {
  value: number;
  unit: string;
  date: Date;
  style?: StyleProp<TextStyle>;
  color: string;
  severity: RiskIndicatorMap;
  description?: string;
};

export type ParameterMetaData = {
  dataDate: number;
  dataTime: number;
  forecastTime: number;
  level: number;
  maximum: number;
  minimum: number;
  parameterName: string;
  parameterUnits: string;
  shortName: string;
  typeOfLevel: string;
  key: WeatherType;
};

export type RiskIndicator = {
  id: string;
  name: string;
  paramKey: string;
  floor: number;
  ceil: number;
  description: string;
  severity: RiskIndicatorMap;
  color: RiskColorMap;
  severityValue: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  onDate?: Date;
};

export type PointForecastValue = {
  metadata: ParameterMetaData;
  units: string;
  value: number;
  risk?: RiskIndicator;
};

export type WeatherData = {
  name: string;
  value: number;
  units: string;
  date: Date;
  min: number;
  max: number;
  risk?: Partial<RiskIndicator>;
};

export type CurrentWeatherType = Record<string, WeatherData>;

export type WeatherMeta = {
  timezone: string;
  date: string;
  closestCity: string;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  risk?: Partial<RiskIndicator>;
};

export interface CurrentWeatherValues extends WeatherMeta {
  values: CurrentWeatherType;
}

export interface PointForecastDetails extends WeatherMeta {
  values: PointForecastValue[];
  timezone: string;
  date: string;
}

export type MultiDayForecastValues = {
  value: number;
  datetime: string;
};

export interface MultiDayPointForecastDetails extends WeatherMeta {
  units: string;
  values: PointForecastValue[];
}

export type AttentionAlert = {
  label: string;
  style: StyleProp<TextStyle>;
  description: string;
  severity: RiskIndicatorMap;
  color: string;
  onDate?: Date;
};

export interface ForecastWarning {
  risk: RiskIndicator;
  datetime: string;
  value: number;
  forecast: ParameterMetaData;
  location: LocationPoint;
}
