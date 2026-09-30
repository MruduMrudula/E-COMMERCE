import { useToast } from "../Contexts/ToastContext";
import { ScrollView, Text, TextInput, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
// import { sendOrderNotification } from "../utils/notifications";
export default function Checkout() {
  const { cart, getTotal } = useCartStore();
  const { addOrder } = useOrderStore();
const {showToast} = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const deliveryFee = 50;
  const subtotal = getTotal();
  const finalTotal = subtotal + deliveryFee;

  const handlePlaceOrder =  () => {
    if (!name || !phone || !address) {
      showToast("Please fill all address details");
      return;
    }
      const newOrder = {
        id: Date.now().toString(),

        items: cart,

        customer: {
          name: name,
          phone: phone,
          address: address,
        },
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: finalTotal,

        status: "Placed",

        createdAt: new Date().toISOString(),
      };
       addOrder(newOrder);
      //  await sendOrderNotification(newOrder);
       console.log("ORDER CREATED:", newOrder);

    router.replace({
      pathname: "/order-success",
      params: {
        total: finalTotal.toFixed(2),
      },
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Header */}
      <Text className="mb-6 text-2xl font-bold text-gray-900">Checkout</Text>

      {/* Address */}
      <Text className="mb-3 text-lg font-bold text-gray-900">
        Delivery Address
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        className="mb-3 rounded-xl border border-gray-300 px-4 py-3"
      />

      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        className="mb-3 rounded-xl border border-gray-300 px-4 py-3"
      />

      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Full Address"
        multiline
        className="mb-6 rounded-xl border border-gray-300 px-4 py-3"
        style={{ minHeight: 100, textAlignVertical: "top" }}
      />

      {/* Order Summary */}
      <Text className="mb-3 text-lg font-bold text-gray-900">
        Order Summary
      </Text>

      {cart.map((item) => (
        <View
          key={item.id}
          className="mb-3 flex-row items-center justify-between"
        >
          <View className="flex-1">
            <Text className="font-semibold text-gray-800">{item.title}</Text>

            <Text className="text-gray-500">Qty: {item.quantity}</Text>
          </View>

          <Text className="font-semibold">₹{item.price * item.quantity}</Text>
        </View>
      ))}

      {/* Price Details */}
      <View className="mt-5 border-t border-gray-200 pt-5">
        <View className="mb-3 flex-row justify-between">
          <Text className="text-gray-600">Subtotal</Text>
          <Text className="font-semibold">₹{subtotal.toFixed(2)}</Text>
        </View>

        <View className="mb-3 flex-row justify-between">
          <Text className="text-gray-600">Delivery</Text>
          <Text className="font-semibold">₹{deliveryFee.toFixed(2)}</Text>
        </View>

        <View className="mt-2 flex-row justify-between">
          <Text className="text-xl font-bold">Total</Text>
          <Text className="text-xl font-bold">₹{finalTotal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Place Order */}
      <Pressable
        onPress={handlePlaceOrder}
        className="mt-8 mb-10 items-center rounded-2xl bg-pink-500 py-4"
      >
        <Text className="text-lg font-bold text-white">Place Order</Text>
      </Pressable>
      <Pressable
        onPress={handlePlaceOrder}
        className="mt-8 mb-10 items-center rounded-2xl bg-red-500 py-4"
      >
        <Text className="text-lg font-bold text-white">Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

