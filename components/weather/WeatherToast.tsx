import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ToastProps {
  message: string;
  duration?: number; // in milliseconds, default is 3000ms
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onHide }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the toast.
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Wait for duration then fade out.
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);
    });
  }, [opacity, duration, onHide]);

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 8, // Spacing between toasts in the stack.
    alignItems: "center",
    width: "90%",
  },
  toastText: {
    color: "#fff",
  },
});

export default Toast;
