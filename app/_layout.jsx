import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { StatusBar } from "expo-status-bar";
import {  View ,Animated,} from "react-native";
import { ToastProvider } from "../Contexts/ToastContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupNotifications } from "../utils/notifications";
import "../global.css";
import { useEffect,  useState } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();
function AnimatedSplash() {
 const [scale] = useState(() => new Animated.Value(0.5));
  const [opacity] = useState(() => new Animated.Value(0));
  useEffect(()=>{
   const animation =  Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  },[opacity, scale]);
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Animated.Image
        source={require("../assets/e-commerce-app-logo.png")}
        resizeMode="contain"
        style={{
          width: 250,
          height: 250,
          opacity,
          transform: [{ scale }],
        }}
      />
    </View>
  );
}
function AppNavigation() {
  const { isLoaded } = useAuth();

   const [minimumTimePassed, setMinimumTimePassed] = useState(false);

   useEffect(() => {
     const timer = setTimeout(() => {
       setMinimumTimePassed(true);
     }, 2000);

     return () => clearTimeout(timer);
   }, []);

   if (!isLoaded || !minimumTimePassed) {
     return <AnimatedSplash />;
   }
  return (
    <ToastProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="login" options={{ headerShown: false }} />

        <Stack.Screen name="signUp" options={{ headerShown: false }} />

        <Stack.Screen name="verify" options={{ headerShown: false }} />

        <Stack.Screen name="forgot" options={{ headerShown: false }} />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />

        <Stack.Screen name="productScreen" options={{ headerShown: false }} />

        <Stack.Screen name="order-details" options={{ headerShown: false }} />

        <Stack.Screen name="Product/[id]" options={{ headerShown: false }} />

        <Stack.Screen name="wishlistScreen" options={{ headerShown: false }} />

        <Stack.Screen name="location" options={{ headerShown: false }} />

        <Stack.Screen name="orders" options={{ headerShown: false }} />

        <Stack.Screen name="checkout" options={{ headerShown: false }} />

        <Stack.Screen name="order-success" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ headerShown: false }} />
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
      </Stack>

      <StatusBar style="light" />
    </ToastProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    setupNotifications().then((result) => {
      console.log("NOTIFICATION SETUP RESULT:", result);
    });
  }, []);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <AppNavigation />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
































































































// import { Stack, Redirect } from "expo-router";
// import { ClerkProvider, useAuth } from "@clerk/expo";
// import { tokenCache } from "@clerk/expo/token-cache";
// import { StatusBar } from "expo-status-bar";
// import { Text, View } from "react-native";
// import { ToastProvider } from "../Contexts/ToastContext";
// import { useThemeStore } from "../store/themeStore";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { setupNotifications } from "../utils/notifications";
// import "../global.css";
// import { useEffect } from "react";

// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// const queryClient = new QueryClient();

// function AppNavigation() {
//   const { isLoaded, isSignedIn, userId } = useAuth();

//   console.log("ROOT AUTH:", {
//     isLoaded,
//     isSignedIn,
//     userId,
//   });

//   if (!isLoaded) {
//     return (
//       <View className="flex-1 items-center justify-center bg-white">
//         <Text className="text-xl text-black">Clerk Loading...</Text>
//       </View>
//     );
//   }

//   if (!isSignedIn) {
//     return <Redirect href="/login" />;
//   }

//   return (
//     <ToastProvider>
//       <Stack>
//         <Stack.Screen
//           name="(tabs)"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="edit-profile"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="productScreen"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="order-details"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="Product/[id]"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="wishlistScreen"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="location"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="orders"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="checkout"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="order-success"
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="success"
//           options={{
//             presentation: "formSheet",
//             headerShown: false,
//             sheetAllowedDetents: [0.45],
//             sheetInitialDetentIndex: 0,
//             sheetCornerRadius: 30,
//           }}
//         />
//       </Stack>

//       <StatusBar style="light" />
//     </ToastProvider>
//   );
// }

// export default function RootLayout() {
//   useEffect(() => {
//     setupNotifications().then((result) => {
//       console.log("NOTIFICATION SETUP RESULT:", result);
//     });
//   }, []);

//   const isDark = useThemeStore((state) => state.isDark);

//   return (
//     <ClerkProvider
//       publishableKey={publishableKey}
//       tokenCache={tokenCache}
//     >
//       <QueryClientProvider client={queryClient}>
//         <AppNavigation />
//       </QueryClientProvider>
//     </ClerkProvider>
//   );
// }