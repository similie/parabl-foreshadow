import React from "react";
import {
  Modal,
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import { WeatherDetails } from "../weather";
import { LocationPoint } from "@/types/context";
import { LatLng } from "react-native-maps";

interface FullScreenModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  modalLocation: LocationPoint | null;
  selectedLocation: LatLng | null;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({
  modalVisible,
  closeModal,
  modalLocation,
  selectedLocation,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.buttonView} onPress={closeModal}>
            <XMarkIcon size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.modalView}>
            {selectedLocation && (
              <WeatherDetails
                location={modalLocation}
                coords={selectedLocation}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    padding: 5,
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 24,
    right: 24,
    zIndex: 3,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 48,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "white", // Non-transparent background ensures touches are captured
  },

  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default FullScreenModal;
