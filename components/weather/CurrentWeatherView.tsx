import {
  AttentionAlert,
  CurrentWeatherProps,
  RiskIndicatorMap,
  RiskIndicatorMapValue,
  WeatherType,
  WeatherValuesMap,
} from "@types";
import React, { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import {
  CloudySVG,
  CloudCoverText,
  RiskSeverity,
  WeatherAlertRow,
} from "@components";
import {
  buildRiskValue,
  extractSimpleTimeFromDate,
  extractTimeFromTimestamp,
  LegendThresholdSelect,
  riskIndicatorStyle,
} from "@libs";
import Popover from "react-native-popover-view"; // Import Popover

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, text }) => {
  const [keyValues, setKeyValues] = useState<Record<string, WeatherValuesMap>>(
    {},
  );
  const textRefs = useRef<Record<string, React.RefObject<View>>>({});
  const [popoverVisible, setPopoverVisible] = useState<Record<string, boolean>>(
    {},
  );
  const [attentionAlerts, setAttentionAlerts] = useState<AttentionAlert[]>([]);

  const buildWeatherRender = () => {
    const keyValues: Record<string, WeatherValuesMap> = {};
    const alerts: AttentionAlert[] = [];
    for (const key in weather.values) {
      if (!LegendThresholdSelect[key]) {
        continue;
      }
      const selection = LegendThresholdSelect[key]();
      if (!selection) {
        continue;
      }

      const context = weather.values[key];

      if (!context) {
        continue;
      }
      let value = context.value;
      if (selection.unitConvert) {
        const conversion = selection.unitConvert || ((_: number) => -9999);
        selection.min(conversion(context.min));
        selection.max(conversion(context.max));
        value = conversion(context.value);
      }

      keyValues[key] = {
        unit: selection.unit,
        value: value,
        date: context.date,
        description: context.risk?.description || "",
        style: riskIndicatorStyle(context.risk, RiskIndicatorMapValue.moderate),
        color: context.risk?.color || "black",
        severity: context.risk?.severity || RiskIndicatorMap.noThreat,
      };

      if (
        !context.risk?.severity ||
        (context.risk?.severityValue || RiskIndicatorMapValue.noThreat) <
          RiskIndicatorMapValue.moderate
      ) {
        continue;
      }
      alerts.push(buildRiskValue(context.risk));
    }
    setKeyValues(keyValues);
    setAttentionAlerts(alerts);
  };

  useEffect(buildWeatherRender, [weather]);

  const weatherParams: { label: string; key: string }[] = [
    { key: WeatherType.TWO_METER_TEMP, label: "Temperature" },
    { key: WeatherType.WIND_SPEED_GUST, label: "Wind Speed" },
    { key: WeatherType.PRECIPITATION_RATE, label: "Total Rainfall" },
  ];

  return (
    <View className="w-52">
      <View className="flex p-0 w-full overflow-hidden">
        <View className="flex flex-row ">
          <Text style={styles.title}>{text || "Current Weather"}</Text>
          {weather.date && (
            <Text className="ml-auto">
              {extractTimeFromTimestamp(weather.date)}
            </Text>
          )}
        </View>

        <View className="flex flex-row ">
          {weather.closestCity && (
            <Text className="mr-2 max-w-36 text-wrap">
              {weather.closestCity}
            </Text>
          )}

          <CloudCoverText
            className="ml-auto"
            cloudCover={weather.values[WeatherType.TOTAL_CLOUD_COVER]?.value}
          />
        </View>
      </View>

      <View className="flex items-center">
        <CloudySVG
          coverage={weather.values[WeatherType.TOTAL_CLOUD_COVER].value}
          isDay={weather.isDay}
        />
      </View>

      <View className="flex">
        {weatherParams.map((param) => {
          if (!textRefs.current[param.key]) {
            textRefs.current[param.key] = React.createRef<View>();
          }

          return (
            <View
              key={param.key}
              className="flex-row items-center justify-between"
              ref={textRefs.current[param.key]}
            >
              <TouchableOpacity
                className="flex-row items-center justify-between"
                onPress={(e) => {
                  e.stopPropagation();
                  if (!keyValues[param.key]?.description) {
                    return;
                  }
                  setPopoverVisible((prev) => {
                    const newPopoverVisible = { ...prev };
                    newPopoverVisible[param.key] = true;
                    return newPopoverVisible;
                  });
                }}
              >
                <Text
                  style={keyValues[param.key]?.style}
                  className="font-bold w-28 truncate"
                >
                  {param.label}
                </Text>
                <Text
                  style={keyValues[param.key]?.style}
                  className="flex-grow ml-4"
                >
                  {`${keyValues[param.key]?.value || ""}${
                    keyValues[param.key]?.unit || ""
                  }`}
                </Text>
              </TouchableOpacity>
              <Popover
                isVisible={popoverVisible[param.key]}
                from={textRefs.current[param.key]}
                onRequestClose={() =>
                  setPopoverVisible((prev) => {
                    const newPopoverVisible = { ...prev };
                    newPopoverVisible[param.key] = false;
                    return newPopoverVisible;
                  })
                }
              >
                <View className="rounded-lg" style={styles.popoverContainer}>
                  <Text style={styles.popoverText}>
                    <RiskSeverity
                      color={keyValues[param.key]?.color}
                      severity={keyValues[param.key]?.severity}
                      span={20}
                      size={16}
                    />{" "}
                    {keyValues[param.key]?.description || ""}
                  </Text>
                </View>
              </Popover>
            </View>
          );
        })}
      </View>

      <WeatherAlertRow attentionAlerts={attentionAlerts}></WeatherAlertRow>

      <View className="mt-1 border-t-hairline pt-1">
        <View className="flex-row  ">
          <Text style={styles.smallText}>Forecast Time: </Text>
          <Text style={styles.smallText}>
            {extractSimpleTimeFromDate(
              keyValues[WeatherType.TOTAL_CLOUD_COVER]?.date || "",
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CurrentWeather;
const styles = StyleSheet.create({
  alertStyles: {
    padding: 8,
    borderRadius: 5,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 10,
    fontStyle: "italic",
  },

  popoverContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  popoverText: {
    fontSize: 14,
    color: "black",
  },
});
