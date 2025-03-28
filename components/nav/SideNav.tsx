import { LayoutProps } from "@types";
import React, { useEffect, useState } from "react";
import {
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
} from "react-native-heroicons/solid"; // Icon library
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { AnimatePresence, MotiView } from "moti"; // for smooth animations
import { userGlobalStore } from "@/libs/context";
import { router } from "expo-router";
import { LogoIcon } from "../branding";
import { globalEventEmitter, NAVIGATE_TO_GEOPOINT } from "@libs";
const styles = StyleSheet.create({
  container: {},
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

const sideNav: React.FC<LayoutProps> = ({ children }) => {
  const user = userGlobalStore((state) => state.user);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const toggleSideDrawer = () => setSideDrawerOpen(!sideDrawerOpen);

  const profileNavigation = () => {
    router.push("/profile");
  };

  const handleContentSelected = () => {
    setSideDrawerOpen(false);
  };

  useEffect(() => {
    globalEventEmitter.on(NAVIGATE_TO_GEOPOINT, handleContentSelected);

    return () => {
      globalEventEmitter.off(NAVIGATE_TO_GEOPOINT, handleContentSelected);
    };
  }, []);

  return (
    <>
      {/* Hamburger Menu */}
      <TouchableOpacity
        className={`absolute  ${
          Platform.OS === "android" ? "top-4" : "top-16"
        } left-5 bg-white p-3 rounded-full shadow-lg `}
        onPress={toggleSideDrawer}
      >
        <Bars3Icon size={24} color="black" />
      </TouchableOpacity>

      {/* Side Drawer */}
      <AnimatePresence>
        {sideDrawerOpen && (
          <MotiView
            from={{ translateX: -300 }}
            animate={{ translateX: 0 }}
            exit={{ translateX: -300 }}
            transition={{ type: "timing", duration: 300 }}
            className={`absolute top-0 left-0 h-full w-3/4 bg-white shadow-xl p-4 ${
              Platform.OS === "android" ? "pt-4" : "pt-16"
            } z-20`}
          >
            <View style={styles.navbar}>
              <TouchableOpacity onPress={toggleSideDrawer}>
                <LogoIcon />
              </TouchableOpacity>
              <Text>Parabl</Text>
              <TouchableOpacity
                className="self-ends"
                onPress={toggleSideDrawer}
              >
                <XMarkIcon size={24} color="black" />
              </TouchableOpacity>
            </View>
            <>{children}</>
            {user && (
              <View className="absolute bottom-8 left-8">
                <TouchableOpacity
                  className="self-ends"
                  onPress={profileNavigation}
                >
                  <UserCircleIcon color="black" size={36} />
                </TouchableOpacity>
              </View>
            )}
          </MotiView>
        )}
      </AnimatePresence>
    </>
  );
};

export default sideNav;
