
import { Text, View, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
export default function OrderSuccess() {
  const { total } = useLocalSearchParams();

return (
  <View className="flex-1 items-center justify-center bg-white dark:bg-[#151718] px-6">
    <Pressable
      onPress={() => router.back()}
      className="absolute left-5 top-12 z-10 h-10 w-10 items-center justify-center rounded-full shadow"
    >
      <Text className="text-2xl text-black dark:text-white">
        <Ionicons name="chevron-back-sharp" size={18} color="#000000" />
      </Text>
    </Pressable>
    <Text className="mb-4 text-5xl">✅</Text>

    <Text className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
      Order Placed!
    </Text>

    <Text className="mb-2 text-center text-gray-500 dark:text-gray-400">
      Your order has been successfully placed.
    </Text>

    <Text className="mb-8 text-lg font-bold text-gray-900 dark:text-white">
      Total: ₹{total}
    </Text>

    <Pressable
      onPress={() => router.replace("/(tabs)/home")}
      className="w-full items-center rounded-full bg-[#222] py-[16px] dark:bg-white"
    >
      <Text className="text-[16px] font-bold text-white dark:text-black">
        Continue Shopping
      </Text>
    </Pressable>

    <Pressable
      onPress={() => router.push("/orders")}
      className="mt-4 w-full items-center rounded-full bg-[#ecece6] py-[16px] dark:bg-[#303234]"
    >
      <Text className="text-[16px] font-semibold text-black dark:text-white">
        View Orders
      </Text>
    </Pressable>
  </View>
);
}

