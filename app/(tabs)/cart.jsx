import { View, Text, FlatList,Pressable } from "react-native";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import CartItem from "../../components/CartItem";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
export default function Cart() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh =  () => {
    setRefreshing(true);

    setTimeout(() => {
       console.log("Cart refreshed");
      setRefreshing(false);
    }, 500);
  };
  const cart = useCartStore((state) => state.cart);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

return (
  <View className="flex-1 bg-white dark:bg-[#151718] p-4">
    <Pressable
      onPress={() => router.back()}
      className="absolute left-5 top-12 z-10 h-10 w-10 items-center justify-center rounded-full shadow"
    >
      <Text className="text-2xl text-black dark:text-white">
        <Ionicons name="chevron-back-sharp" size={18} color="#000000" />
      </Text>
    </Pressable>

    <Text className="text-3xl font-extrabold mb-4 text-pink-500 mt-20">My Cart</Text>

    {cart.length === 0 ? (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-black dark:text-white">
          Your cart is empty
        </Text>
      </View>
    ) : (
      <>
        <FlatList
          data={cart}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => <CartItem item={item} />}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
        <View className="bg-white dark:bg-[#292929] mx-4 mb-20 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <View className="flex-row items-center justify-between">
            {/* TOTAL */}
            <View>
              <Text className="text-xl text-gray-900 dark:text-gray-400 font-extrabold">
                Total Amount
              </Text>

              <Text className="text-xl text-blue-500 dark:text-white font-bold mt-1">
                ₹{total.toFixed(2)}
              </Text>
            </View>
            {/* CHECKOUT BUTTON */}
            <Pressable
              onPress={() => router.push("/checkout")}
              className="bg-pink-500 dark:bg-pink-600 px-7 py-4 rounded-2xl"
            >
              <Text className=" text-2xl font-extrabold text-white">Checkout</Text>
            </Pressable>
          </View>
        </View>
      </>
    )}
  </View>
);
}

