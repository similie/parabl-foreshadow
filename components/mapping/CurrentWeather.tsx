import { userGlobalStore } from "@/libs/context";
import { getLocationWeather, runCoordinates } from "@libs";
import { LocationObjectCoords } from "expo-location";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const CurrentWeather: React.FC<{ coords: LocationObjectCoords }> = ({
  coords,
}) => {
  useEffect(() => {
    runCoordinates(coords);
  }, []);

  return (
    <View style={styles.container}>
      <View className="bg-white p-4 rounded-lg shadow-lg">
        <Text>{coords?.latitude}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});

export default CurrentWeather;
