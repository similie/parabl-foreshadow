import { Stack } from "expo-router";
// Import your global CSS file
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false, title: "Parabl" }} />
    </GestureHandlerRootView>
  );
}
