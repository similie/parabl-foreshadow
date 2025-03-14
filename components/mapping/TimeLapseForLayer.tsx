import { MapProps, WeatherType } from "@types";
import React, { useEffect, useState, useRef } from "react";
import { AnimationConstants, getMappingLayer } from "@libs";
import { UrlTile } from "react-native-maps";
import { View, StyleSheet } from "react-native";
const TimeLapseForLayer: React.FC<{ layer: MapProps }> = ({ layer }) => {
  const [hourOpacities, setHourOpacities] = useState<number[]>(
    () => [1, ...Array(AnimationConstants.HOUR_RANGE - 1).fill(0)], // all start at 0
  );
  const animRef = useRef<NodeJS.Timeout | null>(null);
  const tileUrlsRef = useRef<string[]>(
    Array.from(
      { length: AnimationConstants.OFF ? 1 : AnimationConstants.HOUR_RANGE },
      (_, h) => getMappingLayer(layer.model, layer.layer as WeatherType, h),
    ),
  );

  const incrementIndex = (index: number) => {
    return index >= AnimationConstants.HOUR_RANGE - 1 ? 0 : ++index;
  };

  const getPreviousIndex = (index: number) => {
    return index <= 0 ? AnimationConstants.HOUR_RANGE - 1 : --index;
  };

  const updateIndexOpacity = (
    index: number,
    increment: number,
    targetOpacity: number,
  ) => {
    const previousIndex = getPreviousIndex(index);
    setHourOpacities((prev) => {
      const updated = [...prev];
      updated[previousIndex] = Math.max(
        updated[previousIndex] - increment,
        0.01,
      );
      updated[index] = Math.min(updated[index] + increment, targetOpacity);
      return updated;
    });
  };

  const timeLapseForLayer = () => {
    if (AnimationConstants.OFF) {
      return;
    }
    let stepCount = 0;
    // final opacity for the new hour
    let index = 0;
    const targetOpacity = 1;
    const increment = targetOpacity / AnimationConstants.STEPS;
    // Clear any existing interval
    if (animRef.current) clearInterval(animRef.current);

    animRef.current = setInterval(() => {
      updateIndexOpacity(index, targetOpacity, targetOpacity);
      index = incrementIndex(index);
    }, AnimationConstants.ANIMATION_INTERVAL_MS * AnimationConstants.STEPS);
  };

  useEffect(() => {
    timeLapseForLayer();
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, []);

  return (
    <>
      {tileUrlsRef.current.map((url, index) => (
        <View
          key={url + "_" + index}
          style={[
            StyleSheet.absoluteFill,
            { opacity: AnimationConstants.OFF ? 1 : hourOpacities[index] },
          ]}
        >
          <UrlTile
            urlTemplate={url}
            flipY={false}
            opacity={layer.opacity}
            offlineMode
          />
        </View>
      ))}
    </>
  );
};

export default TimeLapseForLayer;

/**
 * 
 * 
 * import React, { useRef, useEffect } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import MapView, { UrlTile } from "react-native-maps";
import { MapProps, WeatherType } from "@types";
import { getMappingLayer } from "@libs";

const HOUR_COUNT = 6; // hours 0..5
const FADE_MS = 1000; // cross-fade duration
const PAUSE_MS = 1000; // how long to hold each hour before next fade

export default function TimeLapseForLayer({ layer }: { layer: MapProps }) {
  // Build 6 tile URLs once:
  const tileUrls = Array.from({ length: HOUR_COUNT }, (_, h) =>
    getMappingLayer(layer.model, layer.layer as WeatherType, h),
  );

  // 6 Animated.Value opacities, hour0 starts at 1, others at 0
  const animatedValues = useRef<Animated.Value[]>(
    Array.from(
      { length: HOUR_COUNT },
      (_, i) => new Animated.Value(i === 0 ? 1 : 0),
    ),
  ).current;

  // track the "current" hour index (not in React state => no re-render)
  const currentHourRef = useRef(0);

  // cross-fade from currentHour -> nextHour
  function scheduleNextFade() {
    const current = currentHourRef.current;
    let next = (current + 1) % HOUR_COUNT;

    // fade out current
    const fadeOut = Animated.timing(animatedValues[current], {
      toValue: 0,
      duration: FADE_MS,
      useNativeDriver: true,
      easing: Easing.linear,
    });
    // fade in next
    const fadeIn = Animated.timing(animatedValues[next], {
      toValue: 1,
      duration: FADE_MS,
      useNativeDriver: true,
      easing: Easing.linear,
    });

    // run them in parallel, then pause, then do next fade
    Animated.sequence([
      Animated.parallel([fadeOut, fadeIn]),
      Animated.delay(PAUSE_MS),
    ]).start(() => {
      currentHourRef.current = next;
      scheduleNextFade(); // loop forever
    });
  }

  useEffect(() => {
    // Start looping cross-fade on mount
    scheduleNextFade();
    // no cleanup needed unless you want to interrupt
  }, []);

  return (
    <MapView style={{ flex: 1 }}>
      {tileUrls.map((url, idx) => (
        // We wrap the tile in an Animated.View with absolute fill
        <Animated.View
          key={`hour-${idx}`}
          style={[StyleSheet.absoluteFill, { opacity: animatedValues[idx] }]}
        >
          <UrlTile
            urlTemplate={url}
            flipY={false}
            // Keep tile's own "opacity" prop constant => no reload
            opacity={layer.opacity ?? 0.7}
            tileCacheMaxAge={3600}
            offlineMode
          />
        </Animated.View>
      ))}
    </MapView>
  );
}

 */
