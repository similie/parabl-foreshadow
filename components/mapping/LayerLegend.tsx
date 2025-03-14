import React, { useState } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import { LegendThresholdSelect, LegendColors } from "@libs";
// If using Expo:
import { LinearGradient } from "expo-linear-gradient";
import { LayerLegendProps } from "@types";
// Otherwise:
// import LinearGradient from "react-native-linear-gradient";

const LayerLegend: React.FC<LayerLegendProps> = ({
  id,
  hoverValue,
  ticks = 6,
}) => {
  const [barWidth, setBarWidth] = useState(0);
  const sendSelection = () => {
    const selection = LegendThresholdSelect[id];
    if (selection) {
      const values = selection();
      return values;
    }
    return { unit: "N/A", min: () => 0, max: () => 1 };
  };

  const colors = LegendColors[id] || [];

  const selection = sendSelection();
  const minimum = selection.min();
  const maximum = selection.max();
  const unit = selection.unit;
  /**
   * Handle measuring the width of the gradient bar so
   * we can position the pin indicator properly.
   */
  const onBarLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setBarWidth(width);
  };

  /**
   * Calculate the normalized ratio of hoverValue within [min, max].
   * We'll clamp it so if the hoverValue is out of bounds,
   * it doesn't go beyond the bar.
   */
  const getPinOffset = () => {
    if (hoverValue === undefined) return 0;
    const clamped = Math.max(minimum, Math.min(hoverValue, maximum));
    const ratio = (clamped - minimum) / (maximum - minimum);
    return ratio * barWidth;
  };

  const pinOffset = getPinOffset();

  /**
   * Generate tick values (labels) from min to max.
   * e.g., if ticks=5, we get [min, min+step, min+2step, ..., max].
   */
  const generateTickValues = () => {
    if (ticks < 2) return [];
    const step = (maximum - minimum) / (ticks - 1);
    return Array.from({ length: ticks }, (_, i) => minimum + i * step);
  };

  const tickValues = generateTickValues();

  //   if (colors.length < 2) {
  //     // fallback: log an error, or provide a default color pair
  //     colors = ["#ffffff", "#000000"];
  //   }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Unit (${unit})`}</Text>

      {/* Gradient Bar Container */}
      <View style={styles.gradientBarContainer} onLayout={onBarLayout}>
        <LinearGradient
          colors={colors as [string, string, ...string[]]}
          style={styles.gradientBar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        {/* Optional Pin */}
        {hoverValue !== undefined && (
          <View
            style={[
              styles.pinContainer,
              { left: pinOffset - 10 }, // offset half the pin's width
            ]}
          >
            {/* The “thermometer-like” indicator */}
            <View style={styles.pin} />
            {/* Value label above pin */}
            {/* <Text style={styles.pinValue}>{hoverValue.toFixed(1)}</Text> */}
          </View>
        )}
      </View>

      {/* Tick Labels Row */}
      <View style={styles.ticksRow}>
        {tickValues.map((value, index) => {
          const label = value.toFixed(1);
          const ratio = (value - minimum) / (maximum - minimum);
          const leftOffset = ratio * barWidth;

          return (
            <View
              key={`${id}-tick-${index}`}
              style={[styles.tickLabelContainer, { left: leftOffset - 10 }]}
            >
              <Text style={styles.tickLabel}>{label}</Text>
            </View>
          );
        })}
      </View>

      {/* Min/Max labels if you want separate large labels
          (You can omit this if the tick labels already serve that purpose) */}
      {/* <View style={styles.minMaxRow}>
        <Text style={styles.minLabel}>{min}</Text>
        <Text style={styles.maxLabel}>{max}</Text>
      </View> */}
    </View>
  );
};

export default LayerLegend;

const PIN_HEIGHT = 20;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    // Adjust background if desired:
    // backgroundColor: "white",
  },
  title: {
    fontWeight: "bold",
    // marginBottom: 5,
    fontSize: 14,
  },
  gradientBarContainer: {
    width: "100%",
    height: 20,
    position: "relative",
    overflow: "visible",
    marginBottom: 20,
  },
  gradientBar: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  pinContainer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
  },
  pin: {
    width: 2,
    height: PIN_HEIGHT,
    backgroundColor: "black",
    // marginBottom: 5,
  },
  pinValue: {
    position: "absolute",
    bottom: PIN_HEIGHT + 5,
    textAlign: "center",
    fontSize: 12,
    color: "#333",
  },
  ticksRow: {
    position: "relative",
    height: 0,
    // The tick labels are absolutely positioned on this row
  },
  tickLabelContainer: {
    position: "absolute",
    bottom: 0,
  },
  tickLabel: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  minMaxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  minLabel: {
    fontSize: 12,
    color: "#333",
  },
  maxLabel: {
    fontSize: 12,
    color: "#333",
  },
});
