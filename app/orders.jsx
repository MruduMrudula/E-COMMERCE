
import { ScrollView, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useOrderStore } from "../store/orderStore";

export default function Orders() {
  const { orders } = useOrderStore();

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Header */}
      <Text className="mb-6 text-2xl font-bold text-gray-900">
        My Orders
      </Text>

      {/* No Orders */}
      {orders.length === 0 ? (
        <View className="items-center justify-center py-20">
          <Text className="mb-3 text-5xl">
            📦
          </Text>

          <Text className="text-lg font-bold text-gray-800">
            No Orders Yet
          </Text>

          <Text className="mt-2 text-center text-gray-500">
            Your placed orders will appear here.
          </Text>

          <Pressable
            onPress={() => router.replace("/(tabs)/home")}
            className="mt-6 rounded-xl bg-pink-500 px-6 py-3"
          >
            <Text className="font-bold text-white">
              Start Shopping
            </Text>
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
            className="mb-4 rounded-2xl bg-white p-5"
          >
            <View className="mb-3 flex-row justify-between">
              <Text className="font-bold text-gray-900">
                Order #{order.id.slice(-6)}
              </Text>

              <Text className="font-semibold text-green-600">
                {order.status}
              </Text>
            </View>

            <Text className="mb-2 text-gray-500">
              Items: {order.items.length}
            </Text>

            <Text className="text-lg font-bold text-gray-900">
              ₹{order.total.toFixed(2)}
            </Text>

            <Text className="mt-2 text-sm text-gray-400">
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

