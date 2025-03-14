import { AttentionAlert } from "@types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RiskSeverity } from ".";
import { extractLongTimeFromDate } from "@libs";

const WeatherAlertRow: React.FC<{
  attentionAlerts: AttentionAlert[];
}> = ({ attentionAlerts }) => {
  return (
    <View>
      {attentionAlerts.map((alert, i) => (
        <View
          style={styles.alertStyles}
          className="flex  rounded-lg p-2  mt-1 mb-1"
          key={`alert-${i}`}
        >
          <Text style={styles.title}>{alert.label}</Text>
          <View className="flex-row items-center gap-x-1">
            <RiskSeverity
              color={alert.color}
              severity={alert.severity}
              span={20}
              size={16}
            />
            <Text
              className="pr-2 flex-wrap"
              numberOfLines={0} // Allow unlimited lines
              ellipsizeMode="tail"
              style={[alert.style, styles.smallText]}
            >
              {" "}
              {alert.description}
            </Text>
          </View>
          {alert.onDate && (
            <Text style={styles.smallText}>
              {extractLongTimeFromDate(alert.onDate)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  alertStyles: {
    padding: 8,
    borderRadius: 5,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontWeight: "bold",
    fontSize: 12,
    flexWrap: "wrap", // Ensure text wraps
    // marginBottom: 10,
  },
  smallText: {
    fontSize: 10,
    fontStyle: "italic",
    flexShrink: 1, // Prevents text from overflowing
    flexWrap: "wrap",
  },
});

export default WeatherAlertRow;
