import * as Device from "expo-device";
import * as Notifier from "expo-notifications";
// import { Notifications, Notification } from "react-native-notifications";

import axios from "axios";
import { generateUniqueId } from "./utils";
import { httpServer } from "./config";

// Configure how notifications are displayed when the app is in the foreground
Notifier.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function sendPushTokenToServer(token: string) {
  try {
    const results = await axios.post(
      `${httpServer}/api/v2/user-tokens/search`,
      {
        token: token,
      },
    );
    return results.data;
  } catch (error) {
    console.error("Error sending push token to server:", error);
  }
  return null;
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return generateUniqueId();
  }
  const { status: existingStatus } = await Notifier.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifier.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    throw new Error("Failed to get push token for push notification!");
  }
  token = (await Notifier.getExpoPushTokenAsync()).data;
  console.log(token);
  return token;
}

// export async function registerForPushNotification() {
//   Notifications.registerRemoteNotifications();

//   Notifications.events().registerNotificationReceivedForeground(
//     (notification: Notification, completion) => {
//       console.log(
//         `Notification received in foreground: ${notification.title} : ${notification.body}`,
//       );
//       completion({ alert: false, sound: false, badge: false });
//     },
//   );

//   Notifications.events().registerNotificationOpened(
//     (notification: Notification, completion: () => void) => {
//       console.log(`Notification opened: ${notification.payload}`);
//       completion();
//     },
//   );
// }
