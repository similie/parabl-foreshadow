import React, { useMemo } from "react";
import { RasterSource, RasterLayer } from "@maplibre/maplibre-react-native";
import type { MapProps, WeatherType } from "@types";
import { AnimationConstants, getMappingLayer } from "@libs";

const GLTimeLapseForLayer: React.FC<{
  layer: MapProps;
  currentFrame: number;
  index: number;
  // onFrameChange: (frame: number | null) => void;
}> = ({ layer, currentFrame, index }) => {
  // 1) Precompute URLs once per layer
  const tileUrls = useMemo(() => {
    const count = AnimationConstants.OFF ? 1 : AnimationConstants.HOUR_RANGE;
    return Array.from({ length: count }, (_, h) =>
      getMappingLayer(layer.model, layer.layer as WeatherType, h),
    );
  }, [layer.model, layer.layer]);
  // 3) Instant “swap” duration (you can even make this 0 for no transition)
  const swapDuration = 0; // ms
  return (
    <>
      {tileUrls.map((url, i) => (
        <RasterSource
          key={`src-${layer.layer}-${i}`}
          id={`src-${layer.layer}-${i}`}
          //   tileUrlTemplates={[url]}
          url={url}
          tileSize={256}
          maxZoomLevel={22}
          // attribution={`© ${layer.model} ${layer.layer} ${currentFrame} 4shadow.io`}
        >
          <RasterLayer
            id={`layer-${layer.layer}-${i}`}
            sourceID={`src-${layer.layer}-${i}`}
            style={{
              // Always “live” (never visibility:none), but almost invisible when off
              rasterOpacity: i === currentFrame ? layer.opacity : 0.001,
              // Quick transition so it feels instant
              rasterOpacityTransition: { duration: swapDuration, delay: 0 },
              // Tile textures fade in/out over the same span
              rasterFadeDuration: swapDuration,
            }}
          />
        </RasterSource>
      ))}
    </>
  );
};

export default GLTimeLapseForLayer;
