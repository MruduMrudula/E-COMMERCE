import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-RED-500">
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/login" />;
}
