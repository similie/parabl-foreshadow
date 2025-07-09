import { MarkerView } from "@maplibre/maplibre-react-native";
import { TouchableOpacity } from "react-native";
import PointSvg from "./PointSvg";
import { MAP_POINT_ANCHOR, MAP_POINT_STYLE, MARKER_VIEW_STYLE } from "@libs";

const GLTempMarker: React.FC<{
  tempMarker: [number, number] | null;
  handleModalOpen: (lat: number, lng: number) => void;
}> = ({ tempMarker, handleModalOpen }) => {
  return (
    <>
      {tempMarker && (
        <MarkerView
          key={`temp-marker`}
          id={`mv-temp-marker`}
          coordinate={[tempMarker[0], tempMarker[1]]}
          anchor={{ ...MAP_POINT_ANCHOR }} // align the bottom‐center of your view on the coordinate
          allowOverlap // allow markers to stack
          style={{
            ...MARKER_VIEW_STYLE,
          }}
        >
          <TouchableOpacity
            style={MAP_POINT_STYLE}
            onPress={() => handleModalOpen(tempMarker[1], tempMarker[0])}
          >
            <PointSvg />
          </TouchableOpacity>
        </MarkerView>
      )}
    </>
  );
};

export default GLTempMarker;
