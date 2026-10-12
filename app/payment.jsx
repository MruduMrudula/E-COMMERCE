
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import { sendOrderNotification } from "../utils/notifications";
import { useToast } from "../Contexts/ToastContext";

export default function Payment() {
  const { cart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { showToast } = useToast();

  const {
    name,
    phone,
    address,
    subtotal,
    discount,
    deliveryFee,
    total,
  } = useLocalSearchParams();

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    if (paymentMethod === "UPI" && !upiId) {
      showToast("Please enter UPI ID");
      return;
    }

    if (paymentMethod === "Card") {
      if (!cardNumber || !expiry || !cvv) {
        showToast("Please fill all card details");
        return;
      }
    }

    setIsPaying(true);

    // Dummy payment delay
    setTimeout(async () => {
      const newOrder = {
        id: Date.now().toString(),

        items: cart,

        customer: {
          name: name,
          phone: phone,
          address: address,
        },

        subtotal: Number(subtotal),
        discount: Number(discount),
        deliveryFee: Number(deliveryFee),
        total: Number(total),

        status: "Placed",

        paymentMethod: paymentMethod,
        paymentStatus: "Paid",

        createdAt: new Date().toISOString(),
      };

      addOrder(newOrder);

      await sendOrderNotification(newOrder);

      console.log("ORDER CREATED:", newOrder);

      setIsPaying(false);

      router.replace({
        pathname: "/order-success",
        params: {
          total: Number(total).toFixed(2),
        },
      });
    }, 1500);
  };

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#151718]"
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Header */}

      <Text className="mt-10 mb-6 text-4xl font-bold text-gray-900 dark:text-white">
        Payment
      </Text>

      {/* Amount */}

      <View className="mb-6 rounded-2xl bg-gray-100 p-5 dark:bg-[#292929]">
        <Text className="text-base text-gray-500 dark:text-gray-400">
          Amount to Pay
        </Text>

        <Text className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          ₹{Number(total).toFixed(2)}
        </Text>
      </View>

      {/* Payment Methods */}

      <Text className="mb-4 text-lg font-extrabold text-gray-900 dark:text-white">
        Select Payment Method
      </Text>

      {/* UPI */}

      <Pressable
        onPress={() => setPaymentMethod("UPI")}
        className={`mb-3 rounded-2xl border p-4 ${
          paymentMethod === "UPI"
            ? "border-pink-500 bg-pink-50 dark:bg-[#3a202d]"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <Text className="text-base font-bold text-gray-900 dark:text-white">
          📱 UPI
        </Text>

        <Text className="mt-1 text-gray-500 dark:text-gray-400">
          Pay using UPI
        </Text>
      </Pressable>

      {/* Card */}

      <Pressable
        onPress={() => setPaymentMethod("Card")}
        className={`mb-3 rounded-2xl border p-4 ${
          paymentMethod === "Card"
            ? "border-pink-500 bg-pink-50 dark:bg-[#3a202d]"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <Text className="text-base font-bold text-gray-900 dark:text-white">
          💳 Card
        </Text>

        <Text className="mt-1 text-gray-500 dark:text-gray-400">
          Credit / Debit Card
        </Text>
      </Pressable>

      {/* Cash On Delivery */}

      <Pressable
        onPress={() => setPaymentMethod("Cash on Delivery")}
        className={`mb-6 rounded-2xl border p-4 ${
          paymentMethod === "Cash on Delivery"
            ? "border-pink-500 bg-pink-50 dark:bg-[#3a202d]"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <Text className="text-base font-bold text-gray-900 dark:text-white">
          💵 Cash on Delivery
        </Text>

        <Text className="mt-1 text-gray-500 dark:text-gray-400">
          Pay when your order arrives
        </Text>
      </Pressable>

      {/* UPI Details */}

      {paymentMethod === "UPI" && (
        <View>
          <Text className="mb-2 font-semibold text-gray-900 dark:text-white">
            UPI ID
          </Text>

          <TextInput
            value={upiId}
            onChangeText={setUpiId}
            placeholder="example@upi"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            className="mb-6 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
          />
        </View>
      )}

      {/* Card Details */}

      {paymentMethod === "Card" && (
        <View>
          <Text className="mb-2 font-semibold text-gray-900 dark:text-white">
            Card Number
          </Text>

          <TextInput
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={16}
            className="mb-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
          />

          <View className="flex-row">
            <TextInput
              value={expiry}
              onChangeText={setExpiry}
              placeholder="MM/YY"
              placeholderTextColor="#9CA3AF"
              className="mr-2 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
            />

            <TextInput
              value={cvv}
              onChangeText={setCvv}
              placeholder="CVV"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
              className="ml-2 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
            />
          </View>
        </View>
      )}

      {/* COD Message */}

      {paymentMethod === "Cash on Delivery" && (
        <View className="mb-6 rounded-xl bg-gray-100 p-4 dark:bg-[#292929]">
          <Text className="text-gray-700 dark:text-gray-300">
            You can pay the delivery person when your order arrives.
          </Text>
        </View>
      )}

      {/* Pay Button */}

      <Pressable
        onPress={handlePayment}
        disabled={isPaying}
        className="mt-8 mb-5 items-center rounded-2xl bg-pink-500 py-4 dark:bg-pink-600"
      >
        <Text className="text-lg font-bold text-white">
          {isPaying
            ? "Processing Payment..."
            : paymentMethod === "Cash on Delivery"
            ? "Place Order"
            : `Pay ₹${Number(total).toFixed(2)}`}
        </Text>
      </Pressable>

      {/* Cancel */}

      <Pressable
        onPress={() => router.back()}
        className="mb-10 items-center rounded-2xl bg-red-500 py-4 dark:bg-red-600"
      >
        <Text className="text-lg font-bold text-white">
          Back
        </Text>
      </Pressable>
    </ScrollView>
  );
}

