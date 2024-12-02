import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { BottomNav, Map, SideNav } from "@components";
import { MapProps } from "@types";
export default function MapScreen() {
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedMapLayers, setSelectedMapLayers] = useState<MapProps[]>([]);

  const setMapLayers = (layers: string[], time = 0, startTime = new Date()) => {
    setSelectedMapLayers(
      layers.map((layer) => {
        return { layer, time, startTime };
      }),
    );
  };

  const handleToggleLayer = (layerId: string) => {
    setSelectedLayers((prev) => {
      const updatedLayers = prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId];
      setMapLayers(updatedLayers);
      return updatedLayers;
    });
  };

  return (
    <View className="flex-1 relative">
      {/* Map */}
      <Map selectedLayers={selectedMapLayers} />
      {/* Side Drawer */}
      <SideNav>
        <Text className="text-xl font-bold mb-4">Menu</Text>
        <Text className="mb-2">Option 1</Text>
        <Text className="mb-2">Option 2</Text>
        <Text>Option 3</Text>
      </SideNav>
      {
        <BottomNav
          selectedLayers={selectedLayers}
          onToggleLayer={handleToggleLayer}
        ></BottomNav>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   position: "relative",
  // },
});
