import { ScrollView, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useOrderStore } from "../store/orderStore";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
export default function Orders() {
  const {orders} = useOrderStore();
const { colorScheme } = useColorScheme();
return (
  <ScrollView
    className="flex-1 bg-white dark:bg-[#151718]"
    contentContainerStyle={{ padding: 20 }}
  >
    <Pressable
      onPress={() => router.back()}
      className="absolute left-5 top-12 z-10 h-10 w-10 items-center justify-center rounded-full shadow"
    >
      <Ionicons
        name="chevron-back-sharp"
        size={18}
        color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
      />
    </Pressable>
    {/* Header */}
    <Text className="mt-20 mb-3 text-3xl font-bold text-pink-500 dark:text-pink-500">
      My Orders
    </Text>

    {/* No Orders */}
    {orders.length === 0 ? (
      <View className="items-center justify-center mt-40 py-20">
        <Ionicons name="bag-outline" size={55} color="pink" />

        <Text className="text-lg font-bold text-gray-800 dark:text-white">
          No Orders Yet
        </Text>

        <Text className="mt-2 text-center text-red-400">
          Your placed orders will appear here.
        </Text>

        <Pressable
          onPress={() => router.replace("/(tabs)/home")}
          className="mt-6 rounded-xl bg-pink-500 dark:bg-pink-600 px-6 py-3"
        >
          <Text className="font-bold text-white">Start Shopping</Text>
        </Pressable>
      </View>
    ) : (
      orders.map((order) => (
        <Pressable
          key={order.id}
          onPress={() =>
            router.push({
              pathname: "/order-details",
              params: {
                orderId: order.id,
              },
            })
          }
          className="mb-4 rounded-2xl bg-white dark:bg-[#292929] p-5"
        >
          <View className="mb-3 flex-row justify-between">
            <Text className="font-bold  text-xl text-gray-900 dark:text-white">
              Order #{order.id.slice(-6)}
            </Text>

            <Text className="font-semibold text-green-600 dark:text-green-400">
              {order.status}
            </Text>
          </View>

          <Text className="mb-2 text-base text-gray-500 dark:text-gray-300">
            Items: {order.items.length}
          </Text>

          <Text className="text-lg font-extrabold text-blue-900 dark:text-white">
            ₹{order.total.toFixed(2)}
          </Text>

          <Text className="mt-2 text-base text-gray-400 dark:text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </Pressable>
      ))
    )}
  </ScrollView>
);
}


