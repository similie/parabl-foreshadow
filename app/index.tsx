import React, { useEffect, useState } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import {
  BottomNav,
  Map,
  SideNav,
  SideNavContent,
  WeatherToast,
} from "@components";
import { ForecastWarning, MapProps } from "@types";
import {
  extractMedTimeFromDate,
  getLocationWeatherPoints,
  getUserDetails,
  httpServer,
  registerForPushNotificationsAsync,
  sendPushTokenToServer,
} from "@libs";
import SocketService from "@/libs/websocket";
import {
  locationPointGlobalStore,
  useForecastAlertsStore,
  userGlobalStore,
} from "@/libs/context";
import { User } from "@/types/context";
export default function App() {
  const user = userGlobalStore((state) => state.user);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedMapLayers, setSelectedMapLayers] = useState<MapProps[]>([]);
  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const layerSplit = (layerName: string) => {
    const splits = layerName.split("/");
    const model = splits[0];
    const layer = splits[1];
    return { model, layer };
  };

  const setMapLayers = (layers: string[], opacity: number, time = 0) => {
    setSelectedMapLayers(
      layers.map((layerItem) => {
        const { layer, model } = layerSplit(layerItem);
        return { layer, time, model, opacity };
      }),
    );
  };

  const handleToggleLayer = (layerName: string, opacity: number) => {
    setSelectedLayers((prev) => {
      // const { layer } = layerSplit(layerName);
      const updatedLayers = prev.includes(layerName)
        ? prev.filter((id) => id !== layerName)
        : [...prev, layerName];
      setMapLayers(updatedLayers, opacity);
      return updatedLayers;
    });
  };

  const handleLayerOpacity = (layerName: string, opacity: number) => {
    setSelectedMapLayers((prev) => {
      const updated = prev.map((item) => {
        const { layer } = layerSplit(layerName);
        if (item.layer !== layer) {
          return item;
        }
        item.opacity = opacity;
        return item;
      });

      return updated;
    });
  };

  const applyToStore = (data: ForecastWarning[]) => {
    useForecastAlertsStore.getState().clearAlerts();
    for (const val of data) {
      const id = val.location.id;
      useForecastAlertsStore.getState().addAlert(id, val);
    }
  };

  const foreCastAction = (warnings: ForecastWarning[]) => {
    applyToStore(warnings);
    const showWarnings: string[] = [];
    for (const warning of warnings) {
      const message = `${warning.risk.severity} ${
        warning.risk.name
      } found for "${warning.location.name}" on ${extractMedTimeFromDate(
        warning.datetime,
      )}`;
      showWarnings.push(message);
    }
    setToastMessages(showWarnings);
  };

  const applyUserSubscription = (user: User) => {
    const socket = SocketService.instance;
    socket.subscribe("risks/" + user.id, foreCastAction);
  };

  const handleToastHide = () => {};
  const applyWeatherPoints = () => {
    return getLocationWeatherPoints().then((res) => {
      locationPointGlobalStore.getState().setLocationsList(res);
    });
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    applyUserSubscription(user);
    const socket = SocketService.instance;
    applyWeatherPoints();
    return () => {
      socket.unsubscribe("risks/" + user.id);
    };
  }, [user]);

  useEffect(() => {
    const socket = SocketService.instance;

    registerForPushNotificationsAsync()
      .then(async (token: string) => {
        socket.connect(httpServer, token);
        userGlobalStore.getState().setToken(token);
        const foundUser = await getUserDetails();
        sendPushTokenToServer(token, foundUser).then((results) => {
          const thisUser =
            foundUser ||
            (results?.user && results?.user.id ? results?.user : null);
          if (thisUser && !foundUser) {
            userGlobalStore.getState().setUser(thisUser);
          }
          if (!thisUser) {
            return;
          }
          socket.publish("token", { token, user: thisUser.id });
          if (locationPointGlobalStore.getState().locationsList.length) {
            return;
          }
          applyWeatherPoints();
        });
      })
      .catch((e) => {
        alert(e.message);
      });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust based on your layout
      className={Platform.OS === "android" ? "flex-1" : "flex-1 relative"}
    >
      {/* <View className={Platform.OS === "android" ? "flex-1" : "flex-1 relative"}> */}
      <View style={styles.toastContainer}>
        {toastMessages.map((message, i) => (
          <WeatherToast
            key={`toast-value-${i}`}
            message={message}
            onHide={handleToastHide}
          />
        ))}
      </View>
      {/* Map */}
      <Map selectedLayers={selectedMapLayers} />
      {/* Side Drawer */}
      <SideNav>
        <SideNavContent />
      </SideNav>
      {user && (
        <BottomNav
          selectedLayers={selectedLayers}
          onToggleLayer={handleToggleLayer}
          onOpacityChange={handleLayerOpacity}
        ></BottomNav>
      )}
      {/* </View> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    // Optionally add pointerEvents: "box-none" so touches pass through.
    pointerEvents: "box-none",
    zIndex: 9000,
  },
  // container: {
  //   flex: 1,
  //   position: "relative",
  // },
});
