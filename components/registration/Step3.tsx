import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { regStyles } from "./RegStyles";
import { userGlobalStore } from "@/libs/context";
import {
  assignUserToToken,
  licenseAgreement,
  registerUser,
  storeUserDetails,
} from "@libs";
import Markdown from "react-native-markdown-display";
const Step3: React.FC<{ onPrevious: () => void }> = ({ onPrevious }) => {
  const [licenseVisible, setLicenseVisible] = useState(false);
  const [licenseContent, setLicenseContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleSubmit = async () => {
    try {
      setRegistering(true);
      const registered = await registerUser();
      if (!registered.id) {
        throw new Error(
          "We failed the account registration. Please try again later.",
        );
      }
      userGlobalStore.getState().setUser(registered);
      await assignUserToToken();
      await storeUserDetails(registered);
      Alert.alert("Success", "Registration Complete!");
      router.push("/");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setRegistering(false);
    }
  };

  const fetchLicense = async () => {
    setLoading(true);
    try {
      const response = await licenseAgreement();
      setLicenseContent(response);
      setLicenseVisible(true);
    } catch (error) {
      console.error("Error fetching license:", error);
      Alert.alert("Error", "Failed to load the license.");
    } finally {
      setLoading(false);
    }
  };

  //   licenseAgreement

  return (
    <View style={regStyles.container}>
      {registering ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Registering your account...</Text>
        </View>
      ) : (
        <>
          <Text style={regStyles.title}>Step 3: Save Account</Text>
          <TouchableOpacity style={regStyles.button} onPress={handleSubmit}>
            <Text style={regStyles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={regStyles.button} onPress={onPrevious}>
            <Text style={regStyles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={fetchLicense}>
            <Text style={styles.linkText}>View License Agreement</Text>
          </TouchableOpacity>
        </>
      )}
      {/* License Modal */}
      <Modal
        visible={licenseVisible}
        animationType="slide"
        onRequestClose={() => setLicenseVisible(false)}
      >
        <View className="mt-9" style={styles.modalContainer}>
          {/* <Text style={styles.modalTitle}>License Agreement</Text> */}
          <ScrollView style={styles.modalContent}>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <Markdown>{licenseContent || "Failed to load content."}</Markdown>
            )}
          </ScrollView>
          <TouchableOpacity
            className="self-center"
            style={[regStyles.button, styles.closeButton]}
            onPress={() => setLicenseVisible(false)}
          >
            <Text style={regStyles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    height: 400,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007AFF",
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalContent: {
    flex: 1,
  },
  closeButton: {
    marginTop: 20,
  },
});

export default Step3;

// Reuse styles from Step1
