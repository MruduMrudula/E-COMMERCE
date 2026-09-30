import { View, Text, FlatList,Pressable } from "react-native";

import { useCartStore } from "../../store/cartStore";
import CartItem from "../../components/CartItem";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
export default function Cart() {
  const cart = useCartStore((state) => state.cart);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    // <View className="flex-1  p-4">
      <LinearGradient
        colors={["#292929", "#4A4A4A"]}
        style={{
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 5,
        }}
      >
        
        <Text className="text-2xl font-bold mb-4 text-pink-500 mt-5">My Cart</Text>

        {cart.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-white">Your cart is empty</Text>
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

            <View className=" bg-white p-4 rounded-2xl mb-20">
              <View className="flex-row justify-between">
                <Text className="text-lg text-black font-semibold">Total</Text>

                <Text className="text-xl  text-black font-bold">₹{total.toFixed(2)}</Text>
                <Pressable
                  onPress={() => router.push("/checkout")}
                  className="mt-5  items-center rounded-2xl bg-pink-500 py-4"
                >
                  <Text className="text-lg font-bold text-white ">Checkout</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </LinearGradient>
    // </View>
  );
}
