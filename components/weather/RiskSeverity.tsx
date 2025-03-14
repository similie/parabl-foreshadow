import React from "react";
import { View, StyleSheet } from "react-native";
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  SunIcon,
  CloudIcon,
  FireIcon,
} from "react-native-heroicons/solid"; // Import icons
import { RiskIndicatorMap } from "@types"; // Import RiskIndicatorMap

// Props definition

interface RiskIndicatorIconProps {
  severity: RiskIndicatorMap;
  color?: string;
  size?: number;
  span?: number;
}

const RiskIndicatorIcon: React.FC<RiskIndicatorIconProps> = ({
  severity,
  color = "#000",
  size = 24,
  span = 40,
}) => {
  // Define the mapping of severity to icons & colors
  const severityIconMap: Record<RiskIndicatorMap, { icon: JSX.Element }> = {
    [RiskIndicatorMap.noThreat]: {
      icon: <ShieldCheckIcon size={size} color={color} />,
    }, // Yellow
    [RiskIndicatorMap.vLow]: {
      icon: <SunIcon size={size} color={color} />,
    }, // Light Yellow
    [RiskIndicatorMap.low]: {
      icon: <CloudIcon size={size} color={color} />,
    }, // Orange
    [RiskIndicatorMap.moderate]: {
      icon: <ExclamationTriangleIcon size={size} color={color} />,
    }, // Dark Orange
    [RiskIndicatorMap.high]: {
      icon: <FireIcon size={size} color={color} />,
    }, // Red
    [RiskIndicatorMap.vHigh]: {
      icon: <FireIcon size={size} color={color} />,
    }, // Dark Red
  };

  const selected =
    severityIconMap[severity] || severityIconMap[RiskIndicatorMap.noThreat];
  return (
    <View style={[styles.iconContainer, { width: span, height: span }]}>
      {selected.icon}
    </View>
  );
};

export default RiskIndicatorIcon;

// Styles
const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
