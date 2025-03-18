import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import MapView, {
  LatLng,
  Region,
  Marker,
  Callout,
  MapPressEvent,
  MarkerPressEvent,
  LongPressEvent,
} from "react-native-maps";
import {
  debounceCallback,
  getUserLocation,
  globalEventEmitter,
  locationPointGlobalStore,
  NAVIGATE_TO_GEOPOINT,
  SIMILIE_BLUE,
  userGlobalStore,
} from "@libs";
import type { MapProps, SelectedAddress } from "@types";
import { PlusIcon, MinusIcon } from "react-native-heroicons/solid";
import CurrentWeather from "./CurrentWeather";
import TimeLapseForLayer from "./TimeLapseForLayer";
import { LocationObjectCoords } from "expo-location";
import { LocationPoint } from "@/types/context";
import ForecastModal from "./ForecastModal";
import MapSearchBar from "./MapSearchBar";

const { width: mapViewWidth } = Dimensions.get("window");
const THRESHOLD = 0.001;
const MIN_ZOOM_LEVEL = 2;
const MAX_LATITUDE_DELTA =
  (360 / Math.pow(2, MIN_ZOOM_LEVEL)) * (mapViewWidth / 256);
const MAX_LONGITUDE_DELTA =
  (360 / Math.pow(2, MIN_ZOOM_LEVEL)) * (mapViewWidth / 256);

const Map: React.FC<{ selectedLayers: MapProps[] }> = ({ selectedLayers }) => {
  const user = userGlobalStore((state) => state.user);
  const locations = locationPointGlobalStore((state) => state.locationsList);
  const [currentCoordinates, setCurrentCoordinates] =
    useState<LocationObjectCoords | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [showRecenterButton, setShowRecenterButton] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLocation, setModalLocation] = useState<LocationPoint | null>(
    null,
  );
  const [tempMarker, setTempMarker] = useState<LatLng | null>(null);
  const [onChange, setOnChange] = useState<((region: Region) => void)[]>([]);
  // State for custom Android callout overlay
  const [customCallout, setCustomCallout] = useState<{
    x: number;
    y: number;
    name: string;
  } | null>(null);
  // const [targetRegion, setTargetRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const calculateZoomLevel = (longitudeDelta: number) => {
    const zoomLevel =
      Math.log2((360 * (mapViewWidth / 256)) / longitudeDelta) + 1;
    return Math.floor(zoomLevel);
  };

  const logZoomLevel = async (region: Region) => {
    if (!mapRef.current) return;
    const camera = await mapRef.current.getCamera();
    console.log(
      "Zoom Level:",
      calculateZoomLevel(region.longitudeDelta),
      camera,
    );
  };

  const runLocation = async () => {
    try {
      setModalLocation(null);
      const currentLocation = await getUserLocation();
      const region = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setInitialRegion(region);
      setCurrentRegion(region);
      setCurrentCoordinates(currentLocation.coords);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    const handler = (geopoint: LocationPoint) => {
      if (!mapRef.current) return;
      mapRef.current.animateToRegion(
        {
          latitude: geopoint.latitude,
          longitude: geopoint.longitude,
          latitudeDelta: currentRegion?.latitudeDelta || 0.0922,
          longitudeDelta: currentRegion?.longitudeDelta || 0.0421,
        },
        1000,
      );
      setCurrentCoordinates({
        latitude: geopoint.latitude,
        longitude: geopoint.longitude,
      } as LocationObjectCoords);
    };
    setTempMarker(null);
    globalEventEmitter.on(NAVIGATE_TO_GEOPOINT, handler);
    runLocation();
    return () => {
      globalEventEmitter.off(NAVIGATE_TO_GEOPOINT, handler);
    };
  }, []);

  const handleBounceBack = (region: Region) => {
    if (!currentRegion) return false;
    const latDiff = Math.abs(currentRegion.latitude - region.latitude);
    const lonDiff = Math.abs(currentRegion.longitude - region.longitude);
    const latDeltaDiff = Math.abs(
      currentRegion.latitudeDelta - region.latitudeDelta,
    );
    const lonDeltaDiff = Math.abs(
      currentRegion.longitudeDelta - region.longitudeDelta,
    );
    return (
      latDiff < THRESHOLD &&
      lonDiff < THRESHOLD &&
      latDeltaDiff < THRESHOLD &&
      lonDeltaDiff < THRESHOLD
    );
  };

  const callBackEvent = (region: Region) => {
    let changeFun = onChange.pop();
    while (changeFun) {
      changeFun(region);
      changeFun = onChange.pop();
    }
  };

  const handleRegionChangeComplete = async (region: Region) => {
    if (handleBounceBack(region)) return callBackEvent(region);

    setCustomCallout(null);

    let { latitudeDelta, longitudeDelta } = region;
    const currentZoom = calculateZoomLevel(longitudeDelta);
    if (currentZoom < MIN_ZOOM_LEVEL) {
      latitudeDelta = Math.min(latitudeDelta, MAX_LATITUDE_DELTA);
      longitudeDelta = Math.min(longitudeDelta, MAX_LONGITUDE_DELTA);
      if (initialRegion && mapRef.current) {
        const correctedRegion = {
          ...region,
          latitudeDelta,
          longitudeDelta,
        };
        mapRef.current.animateToRegion(correctedRegion, 200);
        setCurrentRegion(correctedRegion);
        return;
      }
    }
    setCurrentRegion(region);
    if (initialRegion) {
      const distance = Math.sqrt(
        Math.pow(initialRegion.latitude - region.latitude, 2) +
          Math.pow(initialRegion.longitude - region.longitude, 2),
      );
      setShowRecenterButton(distance > 0.01);
    }
    await logZoomLevel(region);
    callBackEvent(region);
  };

  const recenterMap = () => {
    if (!initialRegion || !mapRef.current) return;
    setTempMarker(null);
    mapRef.current.animateToRegion(initialRegion, 1000);
    setShowRecenterButton(false);
    setCurrentRegion(initialRegion);
    setCurrentCoordinates({
      latitude: initialRegion.latitude,
      longitude: initialRegion.longitude,
    } as LocationObjectCoords);
  };

  const zoomIn = () => {
    setCurrentRegion((prevRegion) => {
      if (prevRegion) {
        const newLatitudeDelta = prevRegion.latitudeDelta / 2;
        const newLongitudeDelta = prevRegion.longitudeDelta / 2;
        return {
          ...prevRegion,
          latitudeDelta: newLatitudeDelta,
          longitudeDelta: newLongitudeDelta,
        };
      }
      return prevRegion;
    });
    if (!currentRegion) return;
    logZoomLevel(currentRegion);
  };

  const zoomOut = () => {
    setCurrentRegion((prevRegion) => {
      if (prevRegion) {
        const newLatitudeDelta = prevRegion.latitudeDelta * 2;
        const newLongitudeDelta = prevRegion.longitudeDelta * 2;
        if (
          newLatitudeDelta > MAX_LATITUDE_DELTA ||
          newLongitudeDelta > MAX_LONGITUDE_DELTA
        ) {
          return prevRegion;
        }
        return {
          ...prevRegion,
          latitudeDelta: newLatitudeDelta,
          longitudeDelta: newLongitudeDelta,
        };
      }
      return prevRegion;
    });
    if (!currentRegion) return;
    logZoomLevel(currentRegion);
  };

  // For iOS, tapping the callout opens the modal.
  // On Android, tapping a marker will convert its coordinate to screen points and display a custom callout overlay.
  const runLocationForAndroid = (
    location: LocationPoint,
    coordinate: LatLng,
  ) => {
    // Convert coordinate to screen point (if supported by the API)
    if (mapRef.current && mapRef.current.pointForCoordinate) {
      mapRef.current
        .pointForCoordinate(coordinate)
        .then((point) => {
          // Adjust position so that the callout appears above the marker
          setCustomCallout({ x: point.x, y: point.y, name: location.name });
          // setCustomCallout({ x: point.x, y: point.y, name: location.name });
        })
        .catch((err) => console.error("Error converting coordinate:", err));
    } else {
      // Fallback if pointForCoordinate isn't available
      setCustomCallout({ x: 100, y: 100, name: location.name });
    }
  };

  const handleMarkerTap = (location: LocationPoint, coordinate: LatLng) => {
    setModalLocation(location);
    setSelectedLocation(location);
    setTempMarker(null);
    const coords = {
      ...coordinate,
    };
    setCurrentCoordinates(coords as LocationObjectCoords);
    const onChange = () => {
      runLocationForAndroid(location, coords);
    };

    setOnChange((arr) => {
      arr.push(onChange);
      return arr;
    });
  };

  const handleMarkerPress = (location: LocationPoint) => {
    setModalLocation(location);
    const coords = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    setSelectedLocation(coords);
    setCurrentCoordinates(coords as LocationObjectCoords);
    setModalVisible(true);
    // Hide custom callout on Android if present.
    if (Platform.OS === "android") {
      setCustomCallout(null);
    }
  };

  const debouncedLocalPress = useCallback(
    debounceCallback((coordinate: LatLng) => {
      setCustomCallout(null);
      setCurrentCoordinates(coordinate as LocationObjectCoords);
      setTempMarker(coordinate);
    }, 300),
    [],
  );

  const handleLocalPress = useCallback(
    (event: MapPressEvent) => {
      const { coordinate } = event.nativeEvent;
      debouncedLocalPress(coordinate);
    },
    [debouncedLocalPress],
  );

  const handlePressEvent = (e: LongPressEvent | MarkerPressEvent) => {
    const { coordinate } = e.nativeEvent;
    setCustomCallout(null);
    setSelectedLocation(coordinate);
    setModalLocation(null);
    setModalVisible(true);
  };

  const onSelect = (address: SelectedAddress) => {
    // Define a new region around the selected location
    // Adjust latitudeDelta and longitudeDelta for your desired zoom level
    const newRegion: Region = {
      latitude: address.latitude,
      longitude: address.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    // Animate the map to the new region
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }

    // Update state so that a marker is placed at the selected location.
    const coords = {
      latitude: address.latitude,
      longitude: address.longitude,
    };
    setSelectedLocation(coords);
    setCurrentRegion(newRegion);
    setCurrentCoordinates(coords as LocationObjectCoords);

    const onChange = () => {
      setTempMarker(coords);
    };

    setOnChange((arr) => {
      arr.push(onChange);
      return arr;
    });
  };

  return (
    <View style={styles.container}>
      {currentCoordinates && (!modalVisible || Platform.OS === "ios") && (
        <CurrentWeather location={null} coords={currentCoordinates} />
      )}

      {modalVisible && (
        <ForecastModal
          modalVisible={modalVisible}
          closeModal={() => {
            setModalVisible(false);
            setModalLocation(null);
          }}
          modalLocation={modalLocation}
          selectedLocation={selectedLocation}
        />
      )}
      <View
        className={`absolute w-full     ${
          Platform.OS === "ios"
            ? `pl-4 bottom-9 z-20  ${user ? "pr-28" : "pr-4"}`
            : `pl-2 left-0 bottom-4 z-10 ${user ? "pr-28" : "pr-4"}`
        }`}
      >
        <MapSearchBar onSelect={onSelect} />
      </View>
      <MapView
        ref={mapRef}
        onPress={handleLocalPress}
        onLongPress={(e) => {
          setTempMarker(null);
          handlePressEvent(e);
        }}
        mapPadding={
          Platform.OS === "android"
            ? { top: 0, right: 0, bottom: 46, left: 0 }
            : { top: 0, right: 0, bottom: -32, left: 8 }
        }
        style={styles.map}
        showsUserLocation={true}
        initialRegion={initialRegion || undefined}
        region={currentRegion || undefined}
        onRegionChangeComplete={handleRegionChangeComplete}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {selectedLayers.map((layer, layerIndex) => (
          <TimeLapseForLayer layer={layer} key={`layer-${layerIndex}`} />
        ))}

        {tempMarker && (
          <Marker
            pinColor={SIMILIE_BLUE}
            onPress={(e) => {
              e.stopPropagation();
              handlePressEvent(e);
            }}
            coordinate={tempMarker}
          />
        )}

        {locations &&
          locations.map((location) =>
            location ? (
              Platform.OS === "android" ? (
                <Marker
                  key={location?.id}
                  coordinate={{
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                  }}
                  tracksViewChanges={true}
                  onPress={(e) => {
                    e.stopPropagation();
                    if (e.preventDefault) {
                      e.preventDefault();
                    }
                    handleMarkerTap(location, e.nativeEvent.coordinate);
                  }}
                  pinColor={location.alerts?.length ? "#FF0000" : "#0000FF"}
                />
              ) : (
                <Marker
                  key={location?.id}
                  coordinate={{
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                  }}
                  onPress={(e) => e.stopPropagation()}
                  pinColor={location.alerts?.length ? "red" : "black"}
                  onCalloutPress={() => handleMarkerPress(location)}
                >
                  <Callout style={styles.calloutWrapper}>
                    <View style={styles.callout}>
                      <Text style={styles.calloutText}>{location?.name}</Text>
                    </View>
                  </Callout>
                </Marker>
              )
            ) : null,
          )}
      </MapView>

      {/* Custom Callout Overlay for Android */}
      {Platform.OS === "android" && customCallout && (
        <View
          style={[
            styles.customCalloutOverlay,
            {
              left: customCallout.x - 50, // adjust based on callout width
              top: customCallout.y - 70, // position above marker
            },
          ]}
        >
          <TouchableOpacity
            style={styles.customCalloutContainer}
            onPress={() => handleMarkerPress(selectedLocation as LocationPoint)}
          >
            <Text style={styles.customCalloutText}>{customCallout.name}</Text>
          </TouchableOpacity>
        </View>
      )}

      {Platform.OS === "ios" && showRecenterButton && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={(e) => {
            e.stopPropagation();
            recenterMap();
          }}
        >
          <Text style={styles.recenterButtonText}>Recenter</Text>
        </TouchableOpacity>
      )}

      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={(e) => {
            e.stopPropagation();
            zoomIn();
          }}
        >
          <PlusIcon size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={(e) => {
            e.stopPropagation();
            zoomOut();
          }}
        >
          <MinusIcon size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  recenterButton: {
    position: "absolute",
    bottom: 84,
    right: 24,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 5,
  },
  recenterButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  zoomControls: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 64 : 74,
    left: 16,
    flexDirection: "column",
  },
  zoomButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  calloutWrapper: {
    // zIndex: 1000,
  },
  callout: {
    backgroundColor: "white",
    padding: 8,
    // zIndex: 50,
    // borderRadius: 6,
  },
  calloutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  customCalloutOverlay: {
    position: "absolute",
    zIndex: 15,
    // left and top will be dynamically set from state
  },
  customCalloutContainer: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 6,
    elevation: 5,
  },
  customCalloutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default Map;
