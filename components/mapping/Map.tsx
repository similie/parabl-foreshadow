import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import MapView, { Region, UrlTile } from "react-native-maps";
import { getMappingLayer, getUserLocation } from "@libs";
import type { MapProps, ObjectLocation, WeatherType } from "@types";
import { PlusIcon, MinusIcon } from "react-native-heroicons/solid"; // Icon library
const Map: React.FC<{ selectedLayers: MapProps[] }> = ({ selectedLayers }) => {
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [showRecenterButton, setShowRecenterButton] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  const { width: mapViewWidth } = Dimensions.get("window");

  const calculateZoomLevel = (longitudeDelta: number) => {
    const zoomLevel =
      Math.log2((360 * (mapViewWidth / 256)) / longitudeDelta) + 1;
    return Math.floor(zoomLevel);
  };

  const logZoomLevel = async (region: Region) => {
    if (!mapRef.current) {
      return;
    }
    const camera = await mapRef.current.getCamera();
    console.log(
      "Zoom Level:",
      calculateZoomLevel(region.longitudeDelta),
      camera,
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const currentLocation = await getUserLocation();
        const region = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setInitialRegion(region);
        setCurrentRegion(region);
      } catch (e: any) {
        console.error(e.message);
      }
    })();
  }, []);

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region);
    if (initialRegion) {
      const distance = getDistance(initialRegion, region);
      setShowRecenterButton(distance > 0.01); // Adjust threshold as needed
    }
    logZoomLevel(region);
    // const zoomLevel = calculateZoomLevel(region.longitudeDelta);
    // console.log("Zoom Level:", zoomLevel);
  };

  const recenterMap = () => {
    if (initialRegion && mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000); // 1000ms animation
      setShowRecenterButton(false);
    }
  };

  const getDistance = (region1: Region, region2: Region) => {
    const latDiff = region1.latitude - region2.latitude;
    const lonDiff = region1.longitude - region2.longitude;
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
  };

  const zoomIn = () => {
    setCurrentRegion((prevRegion) => {
      if (prevRegion) {
        return {
          ...prevRegion,
          latitudeDelta: prevRegion.latitudeDelta / 2,
          longitudeDelta: prevRegion.longitudeDelta / 2,
        };
      }
      return prevRegion;
    });
    if (!currentRegion) {
      return;
    }
    logZoomLevel(currentRegion);
  };

  const zoomOut = () => {
    setCurrentRegion((prevRegion) => {
      if (prevRegion) {
        return {
          ...prevRegion,
          latitudeDelta: prevRegion.latitudeDelta * 2,
          longitudeDelta: prevRegion.longitudeDelta * 2,
        };
      }
      return prevRegion;
    });
    if (!currentRegion) {
      return;
    }
    logZoomLevel(currentRegion);
  };

  return (
    <View style={styles.container}>
      {/* {selectedLayers.map((layer, index) => (
        <Text>{layer.layer}</Text>
      ))} */}
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={initialRegion || undefined}
        region={currentRegion || undefined}
        onRegionChangeComplete={handleRegionChangeComplete}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {/* Render selected layers here */}
        {/* urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" */}
        {selectedLayers.map((layer, index) => (
          <UrlTile
            key={index}
            urlTemplate={getMappingLayer(
              layer.layer as WeatherType,
              layer.time,
              layer.startTime,
            )}
            opacity={0.7}
            maximumZ={11} // Adjust based on your tile server's capabilities
            flipY={false} // Set to true if your tile server uses inverted Y coordinates
          />
        ))}
      </MapView>
      {showRecenterButton && (
        <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
          <Text style={styles.recenterButtonText}>Recenter</Text>
        </TouchableOpacity>
      )}

      <View className="absolute bottom-24 left-5 flex flex-col space-y-1 space-x-1">
        <TouchableOpacity
          className="bg-white p-3 rounded-full shadow-lg mb-1"
          onPress={zoomIn}
        >
          <PlusIcon />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={zoomOut}
          className="bg-white p-3 rounded-full shadow-lg mt-1"
        >
          <MinusIcon />
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
    bottom: 24,
    left: 24,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 5,
  },
  recenterButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default Map;
