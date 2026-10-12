
import { ScrollView, Text, View, Pressable } from "react-native";
import { useLocalSearchParams , router} from "expo-router";
import { useOrderStore } from "../store/orderStore";
import { Ionicons } from "@expo/vector-icons";
export default function OrderDetails() {
  const { orderId } = useLocalSearchParams();

  const { orders } = useOrderStore();

  const order = orders.find(
    (item) => item.id === orderId
  );

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-bold">
          Order not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 20 }}
    >
      <Pressable
            onPress={() => router.back()}
            className="absolute left-5 top-12 z-10 h-10 w-10 items-center justify-center rounded-full shadow"
          >
            <Text className="text-2xl text-black dark:text-white">
              <Ionicons name="chevron-back-sharp" size={18} color="#000000" />
            </Text>
          </Pressable>
      <Text className="mt-20 mb-3 text-2xl font-bold ">
        Order Details
      </Text>

      {/* Order Information */}
      <View className="mb-5 rounded-2xl  p-5 bg-white">
        <Text className="mb-3 text-lg font-bold">
          Order Information
        </Text>

        <Text className="mb-2 text-gray-600">
          Order ID: #{order.id}
        </Text>

        <Text className="mb-2 text-gray-600">
          Status: {order.status}
        </Text>

        <Text className="text-gray-600">
          Date:{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Customer */}
      <View className="mb-5 rounded-2xl bg-white p-5">
        <Text className="mb-3 text-lg font-bold">
          Delivery Address
        </Text>

        <Text className="mb-1 font-semibold">
          {order.customer.name}
        </Text>

        <Text className="mb-1 text-gray-600">
          {order.customer.phone}
        </Text>

        <Text className="text-gray-600">
          {order.customer.address}
        </Text>
      </View>

      {/* Products */}
      <View className="mb-5 rounded-2xl bg-white p-5">
        <Text className="mb-4 text-lg font-bold">
          Products
        </Text>

        {order.items.map((item) => (
          <View
            key={item.id}
            className="mb-4 border-b border-gray-200 pb-4"
          >
            <Text className="font-semibold">
              {item.title}
            </Text>

            <Text className="mt-1 text-gray-500">
              ₹{item.price} × {item.quantity}
            </Text>

            <Text className="mt-1 font-bold">
              ₹{(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Price */}
      <View className="rounded-2xl bg-white p-5">
        <Text className="mb-3 text-lg font-bold">
          Price Details
        </Text>

        <View className="mb-2 flex-row justify-between">
          <Text className="text-gray-600">
            Subtotal
          </Text>

          <Text>
            ₹{order.subtotal.toFixed(2)}
          </Text>
        </View>

        <View className="mb-3 flex-row justify-between">
          <Text className="text-gray-600">
            Delivery
          </Text>

          <Text>
            ₹{order.deliveryFee.toFixed(2)}
          </Text>
        </View>

        <View className="flex-row justify-between border-t border-gray-200 pt-3">
          <Text className="text-xl font-bold">
            Total
          </Text>

          <Text className="text-xl font-bold">
            ₹{order.total.toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
