import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { CurrentPointWeather } from "@components";
import { CurrentWeatherDrawerProps } from "@types";
import {
  LongPressGestureHandler,
  LongPressGestureHandlerEventPayload,
  HandlerStateChangeEvent,
  // TapGestureHandler,
  State,
  // TapGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
// refresh every hour
const refreshTimeout = 1000 * 60 * 60 * 1;
// The drawer’s total width:
const drawerWidth = 200;
// The "tab" that remains visible when hidden:
const tabWidth = 20;
// The offset for partial hiding:
const hiddenOffset = drawerWidth - tabWidth; // e.g., 180
const CurrentWeatherDrawer: React.FC<CurrentWeatherDrawerProps> = ({
  coords,
}) => {
  const [refresh, setRefresh] = useState<boolean>(false);
  /**
   * We want to start with the drawer fully on-screen => translateX = 0.
   * If the user swipes right, we'll move it to hiddenOffset (180).
   */

  const translateX = useSharedValue(0); // default fully visible
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Start gesture
    })
    .onUpdate((event) => {
      const nextX = translateX.value + event.translationX;
      translateX.value = Math.min(Math.max(nextX, 0), hiddenOffset);
    })
    .onEnd(() => {
      const midpoint = hiddenOffset / 2;
      if (translateX.value > midpoint) {
        translateX.value = withSpring(hiddenOffset, {
          damping: 15,
          stiffness: 120,
        }); // Bounce to hidden position
      } else {
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 120,
        }); // Bounce to open position
      }
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  let timeoutId: NodeJS.Timeout | null = null;

  const applyTimeout = () => {
    timeoutId = setTimeout(refreshedCoordinates, refreshTimeout);
  };

  const refreshedCoordinates = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
      applyTimeout();
    }, 500);
  };

  useEffect(() => {
    setRefresh(false);
    timeoutId && clearTimeout(timeoutId);
    applyTimeout();
    // Update the position of the map when the user drags the drawer.
  }, [coords]);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.drawerContainer, animatedStyle]}
        className="rounded-tl-2xl rounded-bl-2xl"
      >
        <LongPressGestureHandler
          onHandlerStateChange={(
            event: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>,
          ) => {
            // Only trigger when the gesture is active.
            if (event.nativeEvent.state === State.ACTIVE) {
              refreshedCoordinates();
            }
          }}
        >
          <View>
            <CurrentPointWeather
              refresh={refresh}
              location={null}
              coords={coords}
            />
          </View>
        </LongPressGestureHandler>
      </Animated.View>
    </GestureDetector>
  );
};

export default CurrentWeatherDrawer;

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    top: 56,
    right: 0,
    width: drawerWidth,
    backgroundColor: "white",
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    zIndex: 2,
    padding: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: -2, height: 2 },
    elevation: 5,
  },
});
