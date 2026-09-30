import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function setupNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission not granted");
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("orders", {
      name: "Orders",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  return true;
}

export async function sendOrderNotification(order) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Order Placed 🎉",
      body: `Your order #${order.id.slice(-6)} has been placed successfully.`,
      data: {
        orderId: order.id,
      },
    },

    trigger: null,
  });
}
