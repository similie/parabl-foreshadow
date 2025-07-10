import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ArrowPathIcon,
  MinusIcon,
  PlusIcon,
} from "react-native-heroicons/solid";

const GLControls: React.FC<{
  resetCoords: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}> = ({ resetCoords, zoomIn, zoomOut }) => {
  return (
    <>
      {/* Zoom & recenter controls */}
      <View style={styles.controls}>
        <View style={styles.zoomBtns}>
          <TouchableOpacity
            onPress={zoomIn}
            className="p-3 rounded-full shadow-lg bg-white"
          >
            <PlusIcon size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={zoomOut}
            className="p-3 rounded-full shadow-lg bg-white mt-2 mb-2"
          >
            <MinusIcon size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={resetCoords} style={styles.recenterBtn}>
          <ArrowPathIcon size={24} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  recenterButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 5,
  },
  recenterButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  zoomButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 90,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  controls: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 80 : 68,
    // width: "100%",
    left: 16,
    alignItems: "center",
    display: "flex",
  },

  zoomBtns: {
    display: "flex",
    flexDirection: "column",
  },
  recenterBtn: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 25,
    elevation: 2,
  },
});

export default GLControls;
