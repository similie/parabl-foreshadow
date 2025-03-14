// MapLayer.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  //   Slider, // You may need to install @react-native-community/slider
  Modal,
  FlatList,
} from "react-native";
import Slider from "@react-native-community/slider";
import { WeatherType } from "@types";
import { InformationCircleIcon } from "react-native-heroicons/solid"; // Example icons

interface Layer {
  id: string;
  name: string;
  type: WeatherType;
  opacity: number;
  legend: string; // URL or local path to the legend image
}

interface MapLayerProps {
  layers: Layer[];
  onOpacityChange: (layerId: string, opacity: number) => void;
}

const MapLayer: React.FC<MapLayerProps> = ({ layers, onOpacityChange }) => {
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [isLegendVisible, setIsLegendVisible] = useState(false);

  const toggleLegend = (layer: Layer) => {
    setSelectedLayer(layer);
    setIsLegendVisible(!isLegendVisible);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={layers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.layerControl}>
            <Text style={styles.layerName}>{item.name}</Text>
            <View style={styles.controls}>
              {/* Opacity Slider */}
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                value={item.opacity}
                onValueChange={(value) => onOpacityChange(item.id, value)}
              />
              {/* Legend Button */}
              <TouchableOpacity onPress={() => toggleLegend(item)}>
                <InformationCircleIcon size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Legend Modal */}
      {selectedLayer && (
        <Modal
          visible={isLegendVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsLegendVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedLayer.name} Legend</Text>
              {/* Replace with Image component if legends are images */}
              <Text>{selectedLayer.legend}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsLegendVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80, // 60 pixels above the bottom toggle
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 8,
    maxHeight: 200,
    width: 250,
  },
  layerControl: {
    marginBottom: 10,
  },
  layerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    marginRight: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MapLayer;
