import { convertToWeatherValues, runCoordinatesWeather } from "@libs";
import {
  CurrentWeatherDrawerProps,
  CurrentWeatherValues,
  PointForecastDetails,
} from "@types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import CurrentWeatherView from "./CurrentWeatherView";
const CurrentWeather: React.FC<CurrentWeatherDrawerProps> = ({
  coords,
  text,
  refresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setCurrentWeather] = useState<CurrentWeatherValues | null>(
    null,
  );
  const setWeather = (weather: PointForecastDetails | null) => {
    setLoading(false);
    if (!weather) {
      return setError("Failed to get the local weather");
    }
    const localWeather = convertToWeatherValues(weather.values);
    setCurrentWeather({
      ...weather,
      values: localWeather,
    });
  };

  const runAction = () => {
    setLoading(true);
    setError("");
    runCoordinatesWeather(coords).then(setWeather);
  };

  useEffect(runAction, [coords]);

  useEffect(() => {
    if (!refresh) {
      return;
    }
    runAction();
  }, [refresh]);

  return (
    <View>
      {loading && (
        <View>
          <Text
            className="mb-2"
            style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}
          >
            Loading Local Weather
          </Text>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
      {error && !loading && <Text>{error}</Text>}
      {!error && !loading && weather && (
        <CurrentWeatherView text={text} weather={weather} />
      )}
    </View>
  );
};

export default CurrentWeather;
