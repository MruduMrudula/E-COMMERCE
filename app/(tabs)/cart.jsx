import { View, Text, FlatList,Pressable } from "react-native";

import { useCartStore } from "../../store/cartStore";
import CartItem from "../../components/CartItem";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
export default function Cart() {
  const cart = useCartStore((state) => state.cart);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    // <View className="flex-1 bg-gray-100 p-4">
    <LinearGradient
      colors={["#FDF0F3", "#FFFBFC"]}
      style={{
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
      }}
    >
      <Text className="text-2xl font-bold mb-4">My Cart</Text>

      {cart.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => <CartItem item={item} />}
            showsVerticalScrollIndicator={false}
          />

          <View className="bg-white p-4 rounded-2xl mt-3">
            <View className="flex-row justify-between">
              <Text className="text-lg font-semibold">Total</Text>

              <Text className="text-xl font-bold">₹{total.toFixed(2)}</Text>
              <Pressable
                onPress={() => router.push("/checkout")}
                className="mt-5 items-center rounded-2xl bg-pink-500 py-4"
              >
                <Text className="text-lg font-bold text-white">
                  Proceed to Checkout
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </LinearGradient>
    // </View>
  );
}
