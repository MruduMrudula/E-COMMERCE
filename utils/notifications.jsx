import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function setupNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
   
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }
  console.log("NOTIFICATION PERMISSION:", finalStatus);

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
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Order Placed 🎉",
        body: `Your order #${order.id.slice(-6)} has been placed successfully.`,
        data: {
          orderId: order.id,
        },
        sound: "default",
        ...(Platform.OS === "android" && {
          channelId: "orders",
        }),
      },
      trigger: null,
    });

    console.log("NOTIFICATION SCHEDULED:", notificationId);

    return true;
  } catch (error) {
    console.log("NOTIFICATION ERROR:", error);
    return false;
  }
}