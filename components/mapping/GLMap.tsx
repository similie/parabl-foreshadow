// MapLibreMap.tsx
import React, { useState, useEffect, useRef, ComponentRef } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { MapView, Camera, UserLocation } from "@maplibre/maplibre-react-native";
import {
  getUserLocation,
  globalEventEmitter,
  locationPointGlobalStore,
  NAVIGATE_TO_GEOPOINT,
  userGlobalStore,
} from "@libs";
import type { LatLng, LocationObjectCoords, MapProps } from "@types";
import ForecastModal from "./ForecastModal";
import MapSearchBar from "./MapSearchBar";
import { LocationPoint } from "@/types/context";
import GLMapFrame from "./GLMapFrame";
import { CurrentWeather } from ".";
import RenderLocations from "./RenderLocations";
import GLFramePrint from "./GLFramePrint";
import GLTempMarker from "./GLTempMarker";
import GLControls from "./GLControls";
type PointFeature = GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties>;
type ClickFeature = GeoJSON.Feature<
  GeoJSON.Geometry,
  GeoJSON.GeoJsonProperties
>;

const MapLibreMap: React.FC<{ selectedLayers: MapProps[] }> = ({
  selectedLayers,
}) => {
  const user = userGlobalStore((state) => state.user);
  const [mapLoaded, setMapLoaded] = useState(false);
  // persisted locations from global store
  const locations = locationPointGlobalStore((s) => s.locationsList);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  // state for user position & UI
  const [initialCoords, setInitialCoords] = useState<[number, number] | null>(
    null,
  );
  const [currentCoordinates, setCurrentCoordinates] =
    useState<LocationObjectCoords | null>(null);
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLocation, setModalLocation] = useState<LocationPoint | null>(
    null,
  );
  const [frameDate, setFrameDate] = useState<Date | null>(null);
  const [currentFrame, setCurrentFrame] = useState<number | null>(null);
  // refs typed to the actual native instances

  const mapRef = useRef<ComponentRef<typeof MapView>>(null);
  const cameraRef = useRef<ComponentRef<typeof Camera>>(null);

  // On mount: get user location, center map, and listen for external jumps
  useEffect(() => {
    (async () => {
      try {
        const loc = await getUserLocation();
        const coords: [number, number] = [
          loc.coords.longitude,
          loc.coords.latitude,
        ];
        setInitialCoords(coords);
        // setCurrentCoords(coords);
        setCurrentCoordinates({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        // animate once map is ready
        setTimeout(() => {
          cameraRef.current?.setCamera({
            centerCoordinate: coords,
            zoomLevel: 12,
            animationDuration: 1000,
          });
        }, 500);
      } catch (err) {
        console.error("Failed to get user location:", err);
      }
    })();

    const handler = (pt: LocationPoint) => {
      const coords: [number, number] = [pt.longitude, pt.latitude];
      setCurrentCoordinates({
        latitude: pt.latitude,
        longitude: pt.longitude,
      });
      cameraRef.current?.flyTo(coords, 800);
    };
    globalEventEmitter.on(NAVIGATE_TO_GEOPOINT, handler);
    return () => void globalEventEmitter.off(NAVIGATE_TO_GEOPOINT, handler);
  }, []);

  // Zoom in / out handlers
  const zoomIn = async () => {
    const z = await mapRef.current?.getZoom();
    cameraRef.current?.zoomTo((z ?? 0) + 1, 300);
  };
  const zoomOut = async () => {
    const z = await mapRef.current?.getZoom();
    cameraRef.current?.zoomTo((z ?? 0) - 1, 300);
  };

  const pullCoords = (feature: PointFeature) => {
    const { coordinates } = feature.geometry;
    const coords: [number, number] = coordinates as [number, number];
    return {
      coords,
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
  };
  // Map tap -> place temp marker & update weather
  const handlePress = (feature: ClickFeature) => {
    if (!mapLoaded) {
      return;
    }
    console.log("Map pressed at:", feature);
    const { coords, latitude, longitude } = pullCoords(feature as PointFeature);
    setTempMarker(coords);
    // setCurrentCoords(coords);
    setCurrentCoordinates({
      latitude,
      longitude,
    });
    setModalVisible(false);
  };

  // Map long-press -> open forecast modal
  const handleModalOpen = (
    latitude: number,
    longitude: number,
    location: LocationPoint | null = null,
  ) => {
    console.log("Opening modal for:", latitude, longitude);
    setSelectedLocation({ latitude, longitude });
    setModalLocation(location);
    setModalVisible(true);
  };

  const handleLongPress = (feature: ClickFeature) => {
    console.log("Map pressed at:", feature);
    const { latitude, longitude } = pullCoords(feature as PointFeature);
    handleModalOpen(latitude, longitude);
  };

  const onCurrentFrameChange = (frame: number | null) => {
    // console.log("Current frame changed:", frame);
    setCurrentFrame(frame);
    if (frame === null) {
      return setFrameDate(null);
    }
    !frameDate && setFrameDate(new Date()); // Set initial frame date on first change
  };

  const resetCoords = () => {
    if (!initialCoords) {
      return;
    }
    cameraRef.current?.flyTo(initialCoords, 500);
    setTempMarker(null);
    setCurrentCoordinates({
      latitude: initialCoords[1],
      longitude: initialCoords[0],
    });
  };

  return (
    <View style={styles.container}>
      {/* Search bar and optional weather */}
      <View
        className={`absolute w-full     ${
          //   `pl-4 bottom-5 z-20  ${user ? "pr-28" : "pr-4"}`
          Platform.OS === "ios"
            ? `pl-4 bottom-9 z-20  ${user ? "pr-28" : "pr-4"}`
            : `pl-2 left-0 bottom-4 z-10 ${user ? "pr-28" : "pr-4"}`
        }`}
      >
        <MapSearchBar
          onSelect={(addr) => {
            const coords: [number, number] = [addr.longitude, addr.latitude];
            console.log("Search selected:", coords);
            cameraRef.current?.flyTo(coords, 800);
            setTempMarker(coords);
            setCurrentCoordinates({
              latitude: addr.latitude,
              longitude: addr.longitude,
            });
          }}
        />
      </View>
      {/* Current weather drawer */}
      {currentCoordinates && (!modalVisible || Platform.OS === "ios") && (
        <CurrentWeather location={null} coords={currentCoordinates} />
      )}

      <GLFramePrint currentFrame={currentFrame} frameDate={frameDate} />

      {/* MapLibre map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        zoomEnabled
        scrollEnabled
        pitchEnabled
        rotateEnabled
        onPress={handlePress}
        onLongPress={handleLongPress}
        attributionEnabled={false}
        onDidFinishLoadingMap={() => {
          console.log("Map loaded");
          setMapLoaded(true);
        }}
        mapStyle="https://cdn.similie.org/public/app/4shadow/similie-dark.json"
      >
        <Camera ref={cameraRef} />
        <UserLocation />
        {/* Map layers for GLMapFrame */}
        <GLMapFrame
          onFrameChange={onCurrentFrameChange}
          selectedLayers={selectedLayers}
        ></GLMapFrame>

        {/* Temporary marker from user tap */}
        {mapLoaded && (
          <GLTempMarker
            tempMarker={tempMarker}
            handleModalOpen={handleModalOpen}
          />
        )}

        {/* Stored location markers */}
        <RenderLocations
          locations={locations}
          onSelect={(location: LocationPoint) => {
            handleModalOpen(location.latitude, location.longitude, location);
          }}
        />
      </MapView>

      {/* Zoom & recenter controls */}
      <GLControls resetCoords={resetCoords} zoomIn={zoomIn} zoomOut={zoomOut} />

      {/* Forecast modal */}
      {modalVisible && (
        <ForecastModal
          modalVisible={modalVisible}
          closeModal={() => setModalVisible(false)}
          modalLocation={modalLocation}
          selectedLocation={selectedLocation}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  markerView: {
    width: 30,
    height: 40,
    zIndex: 10, // ensure on top of tiles
  },
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapLibreMap;
