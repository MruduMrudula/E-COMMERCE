import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { ToastProvider } from "../Contexts/ToastContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { setupNotifications } from "../utils/notifications";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

function AppNavigation() {
  const { isLoaded, isSignedIn, userId } = useAuth();

  console.log("ROOT AUTH:", {
    isLoaded,
    isSignedIn,
    userId,
  });

  // Don't make the whole screen blank
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl text-black">Clerk Loading...</Text>
      </View>
    );
  }

  return (
    <ToastProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="login" options={{ headerShown: false }} />

        <Stack.Screen name="signUp" options={{ headerShown: false }} />

        <Stack.Screen name="verify" options={{ headerShown: false }} />

        <Stack.Screen name="forgot" options={{ headerShown: false }} />

        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />

        <Stack.Screen name="productScreen" options={{ headerShown: false }} />

        <Stack.Screen name="order-details" options={{ headerShown: false }} />
        <Stack.Screen name="Product/[id]" options={{ headerShown: false }} />

        <Stack.Screen name="orders" options={{ headerShown: false }} />
        <Stack.Screen
          name="success"
          options={{
            presentation: "formSheet",
            headerShown: false,
            sheetAllowedDetents: [0.45],
            sheetInitialDetentIndex: 0,
            sheetCornerRadius: 30,
          }}
        />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style="light" />
    </ToastProvider>
  );
}

export default function RootLayout() {
  // useEffect(() => {
  //   setupNotifications();
  // }, []);
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <AppNavigation />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
