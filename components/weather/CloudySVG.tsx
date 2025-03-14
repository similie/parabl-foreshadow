import { getGrayScaleHex } from "@libs";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

/**
 * The single outer boundary path for your cloud, with the inner path removed.
 */
const CLOUD_VECTOR_PATH = `
  M312,208c0-21.744-12.656-41.384-32.04-50.568
  C278.6,110.088,239.664,72,192,72
  c-33.72,0-63.928,18.928-78.744,48.776
  c-3.064-0.52-6.152-0.776-9.256-0.776
  c-21.76,0-41.408,12.664-50.576,32.056
  C23.736,153.408,0,177.984,0,208c0,30.88,25.128,56,56,56
  h200C286.872,264,312,238.88,312,208z
`;

/**
 * Build either random or "star pattern" cloud placements, up to 20 possible spots.
 */
function getCloudPositions(coverage: number, size: number) {
  const center = size / 2.3;
  const sunRadius = size * 0.1;
  const angleDeg = 288;
  const actualDeg = angleDeg;
  const baseRadiusIncrement = 10;
  const baseRadius = sunRadius + baseRadiusIncrement - 15;
  const rad = (actualDeg * Math.PI) / 180;
  const x = center + baseRadius * Math.cos(rad);
  const y = center + baseRadius * Math.sin(rad);
  const r = 10 + coverage * 0.15;
  return [{ x, y, r }];
}

/**
 * Props:
 *   coverage: 0..100 => how many clouds to show
 *   size?: bounding box px (default 200)
 *   isDay?: boolean => if false, render a moon instead of a sun.
 */
export interface SunCloudCoverProps {
  coverage: number;
  size?: number;
  isDay?: boolean;
}

const SunCloudCover: React.FC<SunCloudCoverProps> = ({
  coverage,
  size = 120,
  isDay = true,
}) => {
  // A) Animation for the sun’s rays (or could be used for clouds too)
  const dashAnim = useRef(new Animated.Value(0)).current;
  const [dashOffset, setDashOffset] = useState(0);
  const rayEffectSpeedMulti = 4;
  const rayEffectSpeed = 15000 * rayEffectSpeedMulti;
  useEffect(() => {
    let isMounted = true;
    function cycleDash() {
      Animated.sequence([
        Animated.timing(dashAnim, {
          toValue: 200,
          duration: rayEffectSpeed,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(dashAnim, {
          toValue: 0,
          duration: rayEffectSpeed,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (isMounted) cycleDash();
      });
    }
    cycleDash();
    const sub = dashAnim.addListener(({ value }) => {
      if (isMounted) setDashOffset(value);
    });

    return () => {
      dashAnim.removeListener(sub);
      isMounted = false;
    };
  }, []);

  // B) Set up common values for positioning
  const center = size / 2;
  const sunRadius = size * 0.25;
  const rayCount = 8;
  const rayLength = size * 0.22;

  // Create the rays (we only use them for the sun)
  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angleDeg = (360 / rayCount) * i;
    const angleRad = (angleDeg * Math.PI) / 180;
    const startX = center + sunRadius * Math.cos(angleRad);
    const startY = center + sunRadius * Math.sin(angleRad);
    const endX = center + (sunRadius + rayLength) * Math.cos(angleRad);
    const endY = center + (sunRadius + rayLength) * Math.sin(angleRad);
    return { startX, startY, endX, endY, key: `ray-${i}` };
  });

  // C) Clouds (always rendered regardless of isDay)
  const maxClouds = 10;
  const cloudPositionsRef = useRef<{ x: number; y: number; r: number }[]>([]);
  const cloudArray = getCloudPositions(coverage, size);
  cloudPositionsRef.current = cloudArray;
  const numClouds = Math.floor((coverage / 100) * maxClouds);

  // This helper scales and translates our cloud vector so it fits near (cx,cy)
  function buildTinyCloudPath(cx: number, cy: number, r: number) {
    const scaleFactor = r / 75;
    const shapeCenterX = 150;
    const shapeCenterY = 132;
    return {
      d: CLOUD_VECTOR_PATH,
      transform: `translate(${cx - shapeCenterX * scaleFactor}, ${
        cy - shapeCenterY * scaleFactor
      }) scale(${scaleFactor})`,
    };
  }

  // D) Render the “celestial body” (sun or moon) based on isDay.
  const renderCelestialBody = () => {
    if (isDay) {
      return (
        <>
          {/* Sun: circle */}
          <Circle
            cx={center}
            cy={center}
            r={sunRadius}
            fill="orange"
            stroke="black"
            strokeWidth={2}
          />
          {/* Sun rays */}
          {rays.map((r) => (
            <Line
              key={r.key}
              x1={r.startX}
              y1={r.startY}
              x2={r.endX}
              y2={r.endY}
              stroke="black"
              strokeWidth={2}
              strokeDasharray="4 2"
              strokeDashoffset={dashOffset}
            />
          ))}
        </>
      );
    } else {
      // Moon: here we use two circles to create a simple crescent effect.
      // The back (full moon) is lightgray with a black stroke.
      // Then we overlay a second circle (using white as the background color)
      // slightly offset to “cut out” part of the circle, forming a crescent.
      return (
        <>
          <Circle
            cx={center}
            cy={center}
            r={sunRadius}
            fill="lightblue"
            stroke="black"
            strokeWidth={2}
          />
          <Circle
            cx={center + sunRadius * 0.3}
            cy={center - sunRadius * 0.2}
            r={sunRadius}
            fill="white"
          />
        </>
      );
    }
  };

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={styles.svgContainer}>
        {/* Render either the sun or the moon */}
        {renderCelestialBody()}

        {/* Render the clouds */}
        {cloudPositionsRef.current.slice(0, numClouds).map((c, idx) => {
          const { d, transform } = buildTinyCloudPath(c.x, c.y, c.r);
          return (
            <Path
              key={`cloud-${idx}`}
              d={d}
              transform={transform}
              fill={getGrayScaleHex(coverage)}
              stroke="gray"
              opacity={0.95}
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default SunCloudCover;

const styles = StyleSheet.create({
  svgContainer: {},
});
