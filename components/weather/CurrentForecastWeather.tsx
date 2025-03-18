import {
  runCoordinatesForecast,
  extractDayTimestamp,
  convertToWeatherValues,
  createLocationWeather,
  getLocationName,
  userGlobalStore,
  deleteLocationWeather,
  locationPointGlobalStore,
} from "@libs";
import {
  CurrentWeatherDrawerProps,
  CurrentWeatherValues,
  PointForecastDetails,
} from "@types";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import CurrentWeatherView from "./CurrentWeatherView";
import { regStyles } from "@components";
import { XMarkIcon } from "react-native-heroicons/solid";
import { LocationPoint } from "@/types/context";
// Get device dimensions.
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CurrentWeather: React.FC<CurrentWeatherDrawerProps> = ({
  coords,
  location,
}) => {
  const user = userGlobalStore((state) => state.user);
  //   const [assigned, setAssigned] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(
    null,
  );
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [weather, setCurrentWeather] = useState<CurrentWeatherValues[] | null>(
    null,
  );

  const setWeather = (weatherData: PointForecastDetails[] | null) => {
    setLoading(false);
    if (!weatherData) {
      return setError("Failed to get the local weather");
    }
    const weatherValues = [];
    for (const w of weatherData) {
      const localWeather = convertToWeatherValues(w.values);
      weatherValues.push({
        ...w,
        values: localWeather,
      });
    }
    setCurrentWeather(weatherValues);
  };

  const addLocationToAlerts = () => {
    if (!user) {
      return;
    }
    setModal(true);
  };

  const saveLocationToAlerts = () => {
    if (!user) {
      return;
    }

    setLoadingAlerts(true);
    createLocationWeather(user.id, name, coords).then((res) => {
      setLoadingAlerts(false);
      setCurrentLocation(res);
      closeModal();
      const locations = locationPointGlobalStore.getState().locationsList;
      locations.push(res);
      locationPointGlobalStore.getState().setLocationsList(locations);
    });
  };

  const removeLocationToAlerts = () => {
    if (!currentLocation) {
      return;
    }

    setLoadingAlerts(true);
    deleteLocationWeather(currentLocation).then(() => {
      setLoadingAlerts(false);
      setCurrentLocation(null);
      closeModal();
      const locations = locationPointGlobalStore.getState().locationsList;
      locationPointGlobalStore
        .getState()
        .setLocationsList(locations.filter((l) => l !== location));
    });
  };

  const closeModal = () => {
    setModal(false);
  };

  const runLocationName = () => {
    getLocationName(coords).then((res) => {
      setName(res.name || "");
    });
  };

  useEffect(() => {
    setCurrentLocation(location);
    setLoading(true);
    // setAssigned(false);
    setError("");
    runLocationName();
    runCoordinatesForecast(coords).then(setWeather);
  }, [coords]);

  const scrollRef = useRef<ScrollView>(null);

  // When content is loaded, force scroll to x = 0 (or adjust if needed)
  useEffect(() => {
    if (!weather) {
      return;
    }

    setTimeout(() => {
      if (scrollRef.current) {
        // This ensures that if there's any initial misalignment, we reset it.
        scrollRef.current.scrollTo({ x: 16, animated: false });
      }
    }, 50); // 100ms delay to wait for layout updates
  }, [weather]);

  if (loading) {
    return (
      <View style={[styles.centered, { flex: 1 }]}>
        <Text style={styles.loadingText}>Loading Local Weather</Text>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { flex: 1 }]}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (loadingAlerts) {
    return (
      <View style={[styles.centered, { flex: 1 }]}>
        <Text style={styles.loadingText}>
          Adding this location to your alerts
        </Text>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modal}
        onRequestClose={closeModal}
      >
        <View className=" bg-white flex justify-center flex-grow flex-col">
          <TouchableOpacity style={styles.buttonView} onPress={closeModal}>
            <XMarkIcon size={24} color="black" />
          </TouchableOpacity>
          <View className="bg-white rounded-lg p-4 ">
            {!currentLocation && (
              <>
                <Text style={{ fontWeight: "700" }}>Location Name</Text>
                <TextInput
                  style={{ ...regStyles.input, width: "100%" }}
                  placeholder="Location Name"
                  keyboardType="default"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  editable={true}
                />
                <TouchableOpacity
                  className="bg-black *:hover:bg-gray-700  p-4 pt-6 *:active:bg-gray-700  text-white text-center  font-bold  rounded-full  shadow-md"
                  onPress={saveLocationToAlerts}
                  disabled={!name || name === "" ? true : false}
                >
                  <Text className="text-white text-center  font-bold  shadow-md">
                    Save Location
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {currentLocation && (
              <>
                <Text className="text-center" style={{ fontWeight: "700" }}>
                  Are you sure you want to remove this location?
                </Text>
                <Text className="text-center mt-4 mb-4">
                  {currentLocation?.name}
                </Text>
                <TouchableOpacity
                  className="bg-red-500 hover:bg-red-700  p-4  *:active:bg-gray-700  text-white text-center  font-bold  rounded-full  shadow-md"
                  onPress={removeLocationToAlerts}
                  disabled={!currentLocation.id}
                >
                  <Text className="text-white text-center  font-bold  shadow-md">
                    Remove Location
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={screenWidth} // Snap every full screen width.
        snapToAlignment="center" // Align the snapped page to the center.
        decelerationRate="fast" // Makes snapping feel more responsive.
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {weather &&
          weather.map((w, i) => (
            <View key={i} style={styles.page}>
              <CurrentWeatherView
                text={extractDayTimestamp(w.date)}
                weather={w}
              />
            </View>
          ))}
      </ScrollView>
      {user && !currentLocation && (
        <TouchableOpacity
          className=" bg-black *:hover:bg-gray-700  p-4 pt-6 *:active:bg-gray-700  text-white   font-bold  rounded-full  shadow-md"
          onPress={addLocationToAlerts}
        >
          <Text className="text-white" style={[styles.loadingText]}>
            Get Alerts from this Location
          </Text>
        </TouchableOpacity>
      )}
      {user && currentLocation && (
        <TouchableOpacity
          className=" bg-red-600 hover:bg-red-700  p-4 pt-6 active:bg-red-500  text-white   font-bold  rounded-full  shadow-md"
          onPress={addLocationToAlerts}
        >
          <Text className="text-white" style={[styles.loadingText]}>
            Remove this location
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    flexGrow: 1,
  },
  // This style centers content on the entire screen.
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  // Each "page" fills the screen and centers its children.
  page: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  buttonView: {
    padding: 5,
    position: "absolute",
    top: 48,
    right: 24,
    zIndex: 3,
  },
});

export default CurrentWeather;
