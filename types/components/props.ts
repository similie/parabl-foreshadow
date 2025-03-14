import { LocationObjectCoords } from "expo-location";
import { CurrentWeatherType, CurrentWeatherValues } from "../weather";
import { LocationPoint } from "../context";

// Define props interface
export interface MapProps {
  layer: string; // Optional layer ID
  time: number;
  model: string;
  opacity: number;
  // startTime?: Date; // Date and time, defaults to new Date()
}

// Define props interface
export interface MapLayerItem {
  id: string; // Optional layer ID
  label: string; // Optional layer ID
  model: string;
  opacity: number;
  params?: Record<string, any>;
}

export interface LayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export interface BottomNavProps {
  selectedLayers: string[];
  onToggleLayer: (layerId: string, opacity: number) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
}

export interface LayerButtonProps {
  layer: MapLayerItem;
  active: boolean;
  onToggleLayer: (layerId: string, opacity: number) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
}

export type LayerLegendProps = {
  id: string;
  /**
   * Optional value to show a "pin" or indicator on the bar.
   * If undefined, the pin is not shown.
   */
  hoverValue?: number;
  /**
   * Optional number of ticks (including min and max) to display under the bar.
   * Defaults to 3 (i.e., min, midpoint, max).
   */
  ticks?: number;
};

export type CurrentWeatherProps = {
  weather: CurrentWeatherValues;
  text?: string;
};

export interface CurrentWeatherDrawerProps {
  coords: LocationObjectCoords;
  text?: string;
  location: LocationPoint | null;
  refresh?: boolean;
}
