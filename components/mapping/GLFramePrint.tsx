import { frameToLocalTime } from "@libs";
import { Platform, Text, View } from "react-native";

const GLFramePrint: React.FC<{
  currentFrame: number | null;
  frameDate: Date | null;
}> = ({ currentFrame, frameDate }) => {
  return (
    <>
      {currentFrame !== null && frameDate !== null && (
        <View
          className={`p-2 bg-white color-black  z-50 rounded-lg absolute  left-24  ${
            Platform.OS === "ios" ? "top-16" : "top-5"
          } `}
        >
          <Text>{frameToLocalTime(currentFrame, frameDate)}</Text>
        </View>
      )}
    </>
  );
};

export default GLFramePrint;
