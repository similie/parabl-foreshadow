import { MarkerView } from "@maplibre/maplibre-react-native";
import React, { useState } from "react";
import PointSvg from "./PointSvg";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LocationPoint } from "@/types/context";
import { MAP_POINT_ANCHOR, MAP_POINT_STYLE, MARKER_VIEW_STYLE } from "@libs";

const RenderLocations: React.FC<{
  locations: LocationPoint[];
  onSelect: (loc: LocationPoint) => void;
  color?: string;
}> = ({ locations, onSelect, color }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <>
      {locations.map((loc) => {
        return (
          <MarkerView
            key={`location-marker-${loc.id}`}
            id={`mv-${"location-marker"}-${loc.id}`}
            coordinate={[loc.longitude, loc.latitude]}
            anchor={{ ...MAP_POINT_ANCHOR }} // align the bottom‐center of your view on the coordinate
            allowOverlap // allow markers to stack
            style={{ ...MARKER_VIEW_STYLE }}
          >
            <TouchableOpacity
              key={`click-${loc.id}`}
              style={MAP_POINT_STYLE}
              onPress={() =>
                setSelectedId((id) => (id === loc.id ? null : loc.id))
              }
            >
              <PointSvg location={loc} color={color} />
            </TouchableOpacity>
          </MarkerView>
        );
      })}

      {locations.map((loc) =>
        selectedId === loc.id ? (
          // 2) Callout
          <MarkerView
            key={`callout-${loc.id}`}
            id={`marker-callout-${loc.id}`}
            coordinate={[loc.longitude, loc.latitude]}
            anchor={{ x: 0.5, y: 0 }}
            allowOverlap
            style={{ width: 120, height: 40 }}
          >
            <TouchableOpacity
              style={styles.calloutContainer}
              onPress={() => {
                console.log("Callout pressed", loc);
                onSelect(loc);
              }}
            >
              <Text style={styles.calloutText}>{loc.name}</Text>
            </TouchableOpacity>
          </MarkerView>
        ) : null,
      )}
    </>
  );
};
const styles = StyleSheet.create({
  calloutContainer: {
    position: "absolute",
    // bottom: 35, // floats just above the pin
    // left: -50, // center horizontally (50 = half callout width)
    width: 120,
    padding: 6,
    backgroundColor: "white",
    borderRadius: 6,
    zIndex: 1000,
    elevation: 4,
    ...(Platform.OS === "ios"
      ? {
          // transform: [{ translateY: ICON_H / 3 }, { translateX: -ICON_W / 2 }], // iOS adjustment
          transform: [{ translateY: 14 }], // iOS adjustment
        }
      : {}),
  },
  calloutText: {
    textAlign: "center",
    fontSize: 12,
  },
});

export default RenderLocations;
// This is a placeholder for the RenderLocations component.
