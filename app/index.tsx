import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { BottomNav, Map, SideNav, SideNavContent } from "@components";
import { MapProps } from "@types";
import {
  httpServer,
  registerForPushNotificationsAsync,
  sendPushTokenToServer,
} from "@libs";
import SocketService from "@/libs/websocket";
import { userGlobalStore } from "@/libs/context";
// import registerNNPushToken from "native-notify";
// import * as Device from 'expo-device';
export default function App() {
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedMapLayers, setSelectedMapLayers] = useState<MapProps[]>([]);
  const setMapLayers = (layers: string[], time = 0, startTime = new Date()) => {
    setSelectedMapLayers(
      layers.map((layer) => {
        return { layer, time, startTime };
      }),
    );
  };

  const handleToggleLayer = (layerId: string) => {
    setSelectedLayers((prev) => {
      const updatedLayers = prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId];
      setMapLayers(updatedLayers);
      return updatedLayers;
    });
  };

  useEffect(() => {
    const socket = SocketService.instance;

    registerForPushNotificationsAsync()
      .then((token: string) => {
        socket.connect(httpServer, token);
        userGlobalStore.getState().setToken(token);
        sendPushTokenToServer(token).then((results) => {
          if (results && results.user) {
            userGlobalStore.getState().setUser(results.user);
          }
          socket.publish("token", { token });
        });
      })
      .catch((e) => {
        alert(e.message);
      });

    socket.subscribe("events", (data) => {
      console.log("EVENTS SUBSCRIPTION", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View className="flex-1 relative">
      {/* Map */}
      <Map selectedLayers={selectedMapLayers} />
      {/* Side Drawer */}
      <SideNav>
        <SideNavContent />
      </SideNav>
      {
        <BottomNav
          selectedLayers={selectedLayers}
          onToggleLayer={handleToggleLayer}
        ></BottomNav>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   position: "relative",
  // },
});
