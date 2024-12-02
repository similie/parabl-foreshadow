// Define props interface
export interface MapProps {
  layer: string; // Optional layer ID
  time: number;
  startTime?: Date; // Date and time, defaults to new Date()
}

export interface LayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export interface BottomNavProps {
  selectedLayers: string[];
  onToggleLayer: (layerId: string) => void;
}
