import { LayoutProps } from "@types";
import React, { useState } from "react";
import { XMarkIcon, Bars3Icon } from "react-native-heroicons/solid"; // Icon library
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { AnimatePresence, MotiView } from "moti"; // for smooth animations

const styles = StyleSheet.create({
  container: {},
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 40, // Adjust size as needed
    height: 40, // Adjust size as needed
    borderRadius: 20, // Makes the avatar circular if the image is square
  },
});

const sideNav: React.FC<LayoutProps> = ({ children }) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const toggleSideDrawer = () => setSideDrawerOpen(!sideDrawerOpen);

  return (
    <>
      {/* Hamburger Menu */}
      <TouchableOpacity
        className="absolute top-16 left-5 bg-white p-3 rounded-full shadow-lg"
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
            className="absolute top-0 left-0 h-full w-3/4 bg-white shadow-xl p-4 pt-16"
          >
            <View style={styles.navbar}>
              <TouchableOpacity onPress={toggleSideDrawer}>
                {/* <Avatar */}
                <Image
                  source={require("../../assets/images/Similie_Icon_Black_RGB.png")} // Replace with the path to your logo
                  style={styles.avatar}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text>Parabl</Text>
              <TouchableOpacity
                className="self-ends"
                onPress={toggleSideDrawer}
              >
                <XMarkIcon size={24} color="black" />
              </TouchableOpacity>
            </View>
            {children}
          </MotiView>
        )}
      </AnimatePresence>
    </>
  );
};

export default sideNav;
