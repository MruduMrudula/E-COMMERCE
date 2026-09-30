
import { Text, View, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function OrderSuccess() {
  const { total } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="mb-4 text-5xl">✅</Text>

      <Text className="mb-2 text-2xl font-bold text-gray-900">
        Order Placed!
      </Text>

      <Text className="mb-2 text-center text-gray-500">
        Your order has been successfully placed.
      </Text>

      <Text className="mb-8 text-lg font-bold">
        Total: ₹{total}
      </Text>

      <Pressable
        onPress={() => router.replace("/(tabs)/home")}
        className="w-full items-center rounded-2xl bg-pink-500 py-4"
      >
        <Text className="text-lg font-bold text-white">
          Continue Shopping
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/orders")}
        className="mt-4 w-full items-center rounded-2xl border border-pink-500 py-4"
      >
        <Text className="text-lg font-bold text-pink-500">
          View Orders
        </Text>
      </Pressable>
    </View>
  );
}

