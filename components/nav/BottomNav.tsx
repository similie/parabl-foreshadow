import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { MotiView } from "moti";
import { ChevronUpIcon, ChevronDownIcon } from "react-native-heroicons/solid";
import { BottomNavProps } from "@types";

const BottomNav: React.FC<BottomNavProps> = ({
  selectedLayers,
  onToggleLayer,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const mapLayers = [
    { id: "temperature", label: "Temperature" },
    { id: "precipitation", label: "Precipitation" },
    { id: "wind", label: "Wind" },
  ];

  const handleGestureEvent = (event: any) => {
    const { translationY, velocityY } = event.nativeEvent;

    if (!isOpen && translationY < -50 && velocityY < -500) {
      setIsOpen(true); // Swipe up to open
    }

    if (isOpen && translationY > 50 && velocityY > 500) {
      setIsOpen(false); // Swipe down to close
    }
  };

  const toggleDrawer = (): void => setIsOpen(!isOpen);

  return (
    <View style={styles.container}>
      <MotiView
        style={[
          styles.bottomDrawer,
          isOpen ? styles.drawerOpen : styles.drawerClosed,
        ]}
        from={{ translateY: isOpen ? 300 : 0 }}
        animate={{ translateY: isOpen ? 0 : 250 }}
        transition={{ type: "timing", duration: 300 }}
      >
        {/* Drawer Header */}
        <PanGestureHandler onGestureEvent={handleGestureEvent}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerHeaderText}>Map Layers</Text>
            <TouchableOpacity onPress={toggleDrawer}>
              {isOpen ? (
                <ChevronDownIcon size={24} color="black" />
              ) : (
                <ChevronUpIcon size={24} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </PanGestureHandler>

        {/* Drawer Content */}
        {isOpen && (
          <View style={styles.drawerContent}>
            {mapLayers.map((layer) => (
              <TouchableOpacity
                key={layer.id}
                style={styles.drawerItem}
                onPress={() => onToggleLayer(layer.id)}
              >
                <Text style={styles.drawerItemText}>{layer.label}</Text>
                <Text style={styles.drawerItemText}>
                  {selectedLayers.includes(layer.id) ? "On" : "Off"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </MotiView>

      {!isOpen && (
        <TouchableOpacity
          className="absolute bottom-5 right-8 bg-white p-3 rounded-full shadow-lg"
          onPress={toggleDrawer}
        >
          <ChevronUpIcon size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  bottomDrawer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  drawerOpen: {
    maxHeight: 300, // Fully expanded
  },
  drawerClosed: {
    maxHeight: 0, // Completely hidden when closed
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#f8f9fa",
  },
  drawerHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  drawerContent: {
    padding: 16,
    marginBottom: 24,
  },
  drawerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  drawerItemText: {
    fontSize: 14,
  },
});
export default BottomNav;
