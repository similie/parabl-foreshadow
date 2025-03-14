import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  locationPointGlobalStore,
  globalEventEmitter,
  NAVIGATE_TO_GEOPOINT,
  buildRiskValue,
  useForecastAlertsStore,
} from "@libs";

import { LocationPoint, User } from "@/types/context";
import { WeatherAlertRow } from "../weather";
import { AttentionAlert } from "@types";

interface LocationListProps {
  user?: User;
}

const LocationList: React.FC<LocationListProps> = ({}) => {
  // Grab the list of locations from a global store (e.g., using Zustand or similar).
  const locations = locationPointGlobalStore((state) => state.locationsList);
  const alerts = useForecastAlertsStore((state) => state.alerts);
  // Local state to track which location (if any) is expanded to show alerts.
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(
    null,
  );

  const [convertedAlerts, setConvertedAlerts] = useState<
    Record<string, AttentionAlert[]>
  >({});

  useEffect(() => {
    const appliedAlerts: Record<string, AttentionAlert[]> = {};
    for (const alertKey in alerts) {
      const alertContent = alerts[alertKey];
      if (!alertContent || !alertContent.length) {
        continue;
      }

      const localAlerts: AttentionAlert[] = [];

      for (const alert of alertContent) {
        const risk = buildRiskValue(alert.risk);
        localAlerts.push(risk);
      }
      appliedAlerts[alertKey] = localAlerts;
    }
    setConvertedAlerts(appliedAlerts);
    // setConvertedAlerts((prev) => {
    //   const newConverted = { ...prev };
    //   // for (const key in appliedAlerts) {
    //   //   const values = appliedAlerts[key];
    //   //   newConverted[key] = values;
    //   // }
    //   return newConverted;
    // });
  }, [alerts]);

  useEffect(() => {
    const appliedAlerts: Record<string, AttentionAlert[]> = {};
    for (const location of locations) {
      if (!location.alerts || !location.alerts.length) {
        continue;
      }
      const localAlerts: AttentionAlert[] = [];
      for (const alert of location.alerts) {
        const risk = buildRiskValue(alert);
        localAlerts.push(risk);
      }
      appliedAlerts[location.id] = localAlerts;
    }
    setConvertedAlerts(appliedAlerts);
  }, [locations]);

  // Handle when a location is pressed.
  const handleLocationPress = (location: LocationPoint) => {
    // Toggle alerts expansion.
    setExpandedLocationId((prev) =>
      prev === location.id ? null : location.id,
    );

    // Broadcast a global event with the geopoint information.
    globalEventEmitter.emit(NAVIGATE_TO_GEOPOINT, location);
  };

  // Render each list item.
  const renderItem = ({ item }: { item: LocationPoint }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleLocationPress(item)}
      >
        <Text style={styles.locationName}>{item.name}</Text>
        {/* Reveal alerts if this location is expanded */}
        {expandedLocationId === item.id && convertedAlerts[item.id] && (
          <View style={styles.alertsContainer}>
            <WeatherAlertRow attentionAlerts={convertedAlerts[item.id]} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        renderItem={renderItem}
        keyExtractor={(item) => (item?.id || -1).toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 16,
    width: "100%",
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  alertsContainer: {
    marginTop: 8,
    paddingLeft: 12,
  },
  alertText: {
    fontSize: 14,
    color: "red",
  },
});

export default LocationList;
