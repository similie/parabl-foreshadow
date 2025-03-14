import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LayerButtonProps } from "@types";
import Slider from "@react-native-community/slider";
import { buildLayerItem } from "@libs";
import LayerLegend from "../mapping/LayerLegend";
const BottomNav: React.FC<LayerButtonProps> = ({
  active,
  layer,
  onToggleLayer,
  onOpacityChange,
}) => {
  return (
    <View style={styles.drawerItem} className="pb-4 pt-4 flex-col">
      <View
        style={styles.layerContainer}
        key={layer.id}
        className="flex content-center items-center"
      >
        <TouchableOpacity
          onPress={() => onToggleLayer(buildLayerItem(layer), layer.opacity)}
        >
          <Text style={styles.drawerItemText}>{layer.label}</Text>
        </TouchableOpacity>
        {active && (
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={layer.opacity}
            onValueChange={(value) =>
              onOpacityChange(buildLayerItem(layer), value)
            }
          ></Slider>
        )}
        <TouchableOpacity
          className=""
          onPress={() => onToggleLayer(buildLayerItem(layer), layer.opacity)}
        >
          <Text style={styles.drawerItemText}>{active ? "On" : "Off"}</Text>
        </TouchableOpacity>
      </View>
      {active && <LayerLegend id={layer.id} />}
    </View>
  );
};

const styles = StyleSheet.create({
  slider: {
    flex: 1,
    marginRight: 10,
  },

  layerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  drawerItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  drawerItemText: {
    fontSize: 14,
  },
});
export default BottomNav;
