import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { MotiView } from "moti";
import { ChevronUpIcon, ChevronDownIcon } from "react-native-heroicons/solid";
import { BottomNavProps } from "@types";
import { MapLayerControl } from "@components";
import { buildLayerItem, mapLayers } from "@libs";
const BottomNav: React.FC<BottomNavProps> = ({
  selectedLayers,
  onToggleLayer,
  onOpacityChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
          <ScrollView style={styles.drawerContent}>
            {mapLayers.map((layer) => (
              /* selectedLayers.includes(buildLayerItem(layer)) */
              <MapLayerControl
                layer={layer}
                key={buildLayerItem(layer)}
                onToggleLayer={onToggleLayer}
                onOpacityChange={onOpacityChange}
                active={selectedLayers.includes(buildLayerItem(layer))}
              />
            ))}
          </ScrollView>
        )}
      </MotiView>

      {!isOpen && (
        <TouchableOpacity
          className="absolute bottom-20 right-8 bg-white p-3 rounded-full shadow-lg"
          onPress={(e) => {
            e.stopPropagation();
            toggleDrawer();
          }}
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
});
export default BottomNav;
