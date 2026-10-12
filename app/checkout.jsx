import { useToast } from "../Contexts/ToastContext";
import { ScrollView, Text, TextInput, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import { sendOrderNotification } from "../utils/notifications";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Checkout() {
  const { cart, getTotal } = useCartStore();
  const { addOrder } = useOrderStore();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const deliveryFee = 50;
  const subtotal = getTotal();
  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setDiscount(0);
      setCouponMessage("Please enter a coupon code");
      return;
    }

    if (code === "WELCOME10") {
      if (subtotal < 500) {
        setDiscount(0);
        setCouponMessage("Minimum order ₹500 required");
        return;
      }

      const discountAmount = subtotal * 0.1;

      setDiscount(discountAmount);
      setCouponMessage("WELCOME10 applied! 10% discount");
      return;
    }

    if (code === "SAVE100") {
      if (subtotal < 999) {
        setDiscount(0);
        setCouponMessage("Minimum order ₹999 required");
        return;
      }

      setDiscount(100);
      setCouponMessage("SAVE100 applied! ₹100 discount");
      return;
    }

    if (code === "FLAT50") {
      if (subtotal < 499) {
        setDiscount(0);
        setCouponMessage("Minimum order ₹499 required");
        return;
      }

      setDiscount(50);
      setCouponMessage("FLAT50 applied! ₹50 discount");
      return;
    }

    setDiscount(0);
    setCouponMessage("Invalid coupon code");
  };

  const handlePlaceOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      showToast("Please fill all address details");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      showToast("Please enter a valid 10-digit phone number");
      return;
    }

    if (cart.length === 0) {
      showToast("Your cart is empty");
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      items: cart,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      },
      subtotal: subtotal,
      discount: discount,
      couponCode: discount > 0 ? couponCode.trim().toUpperCase() : "",
      deliveryFee: deliveryFee,
      total: finalTotal,
      status: "Placed",
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);

    await sendOrderNotification(newOrder);

    console.log("ORDER CREATED:", newOrder);

    router.replace({
      pathname: "/order-success",
      params: {
        total: finalTotal.toFixed(2),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#151718]">
      <ScrollView
        className="flex-1 bg-white dark:bg-[#151718]"
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-5 text-3xl font-extrabold text-pink-500 dark:text-pink-500">
          Checkout
        </Text>

        <Text className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
          Delivery Address
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
          className="mb-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
        />

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          maxLength={10}
          className="mb-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
        />

        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Full Address"
          placeholderTextColor="#9CA3AF"
          multiline
          className="mb-6 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
          style={{ minHeight: 100, textAlignVertical: "top" }}
        />

        <Text className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
          Order Summary
        </Text>

        {cart.map((item) => (
          <View
            key={item.id}
            className="mb-3 flex-row items-center justify-between"
          >
            <View className="flex-1 pr-3">
              <Text className="font-semibold text-gray-800 dark:text-gray-200">
                {item.title}
              </Text>

              <Text className="text-gray-500 dark:text-gray-400">
                Qty: {item.quantity}
              </Text>
            </View>

            <Text className="font-semibold text-gray-900 dark:text-white">
              ₹{(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View className="mt-4 mb-5">
          <Text className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
            Coupon / Discount
          </Text>

          <View className="flex-row items-center">
            <TextInput
              value={couponCode}
              onChangeText={(value) => {
                setCouponCode(value);
                setDiscount(0);
                setCouponMessage("");
              }}
              placeholder="Enter coupon code"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              autoCorrect={false}
              className="mr-2 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
            />

            <Pressable
              onPress={applyCoupon}
              className="rounded-xl bg-pink-500 px-5 py-3"
            >
              <Text className="font-bold text-white">Apply</Text>
            </Pressable>
          </View>

          {couponMessage !== "" && (
            <Text
              className={`mt-2 ${
                discount > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {couponMessage}
            </Text>
          )}

          <Text className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Available coupons: WELCOME10, SAVE100, FLAT50
          </Text>
        </View>

        <View className="mt-2 border-t border-gray-200 pt-5 dark:border-gray-700">
          <View className="mb-3 flex-row justify-between">
            <Text className="text-gray-600 dark:text-gray-400">Subtotal</Text>

            <Text className="font-semibold text-gray-900 dark:text-white">
              ₹{subtotal.toFixed(2)}
            </Text>
          </View>

          <View className="mb-3 flex-row justify-between">
            <Text className="text-gray-600 dark:text-gray-400">Discount</Text>

            <Text className="font-semibold text-green-600">
              -₹{discount.toFixed(2)}
            </Text>
          </View>

          <View className="mb-3 flex-row justify-between">
            <Text className="text-gray-600 dark:text-gray-400">Delivery</Text>

            <Text className="font-semibold text-gray-900 dark:text-white">
              ₹{deliveryFee.toFixed(2)}
            </Text>
          </View>

          <View className="mt-2 flex-row justify-between">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Total
            </Text>

            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{finalTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handlePlaceOrder}
          className="mt-8 mb-4 items-center rounded-2xl bg-pink-500 py-4 dark:bg-pink-600"
        >
          <Text className="text-lg font-bold text-white">Place Order</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          className="mb-10 items-center rounded-2xl border border-gray-300 py-4 dark:border-gray-700"
        >
          <Text className="text-lg font-bold text-gray-700 dark:text-white">
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}