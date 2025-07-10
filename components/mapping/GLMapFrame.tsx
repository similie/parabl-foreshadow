import { AnimationConstants } from "@libs";
import { MapProps } from "@types";
import { useEffect, useState } from "react";
import GLTimeLapseForLayer from "./GLTimeLapseForLayer";
const GLMapFrame: React.FC<{
  selectedLayers: MapProps[];
  onFrameChange: (frame: number | null) => void;
}> = ({ selectedLayers, onFrameChange }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  useEffect(() => {
    console.log("GLMapFrame useEffect triggered", selectedLayers);
    if (selectedLayers.length === 0) {
      // Reset frame when no layers are selected
      setCurrentFrame(0);
      return onFrameChange(null);
    }
    setCurrentFrame(0);
    if (AnimationConstants.OFF) return;
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % AnimationConstants.HOUR_RANGE;
      setCurrentFrame(frame);
      onFrameChange(frame);
    }, AnimationConstants.ANIMATION_INTERVAL_MS * AnimationConstants.STEPS);
    return () => {
      console.log("Clearing interval in GLMapFrame");
      clearInterval(interval);
      // Notify parent component of frame change
      onFrameChange(null);
    };
  }, [selectedLayers]);
  return (
    <>
      {selectedLayers.map((layer, ix) => (
        <GLTimeLapseForLayer
          layer={layer}
          key={`layer-${layer.layer}`}
          currentFrame={currentFrame}
          index={ix}
        />
      ))}
    </>
  );
};

export default GLMapFrame;
