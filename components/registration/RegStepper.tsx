import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const RegistrationStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const steps = [
    <Step1 key={0} onNext={handleNext} />,
    <Step2 key={1} onNext={handleNext} onPrevious={handlePrevious} />,
    <Step3 key={2} onPrevious={handlePrevious} />,
  ];

  return (
    <View className="w-full" style={styles.container}>
      {/* Stepper Progress */}
      <View style={styles.stepper}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[styles.step, currentStep === index && styles.currentStep]}
          />
        ))}
      </View>

      {/* Render Current Step */}
      {steps[currentStep]}
    </View>
  );
};

export default RegistrationStepper;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
  },
  stepper: { flexDirection: "row", marginBottom: 20, justifyContent: "center" },
  step: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  currentStep: { backgroundColor: "#007AFF" },
});
