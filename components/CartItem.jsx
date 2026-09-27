import { View, Text, Pressable, Image } from "react-native";
import { useCartStore } from "../store/cartStore";

export default function CartItem({ item }) {
   
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();

  const imageUrl = item.images?.[0] || item.thumbnail;

  return (
    <View className="bg-white p-4 mb-4 rounded-2xl">
      <View className="flex-row">
        <Image
          source={{ uri: imageUrl }}
          className="w-24 h-24"
          resizeMode="contain"
        />

        <View className="flex-1 ml-4">
          <Text className="font-bold text-base" numberOfLines={2}>
            {item.title}
          </Text>

          <Text className="mt-2">₹{item.price}</Text>

          <View className="flex-row items-center mt-3">
            <Pressable
              onPress={() => decreaseQuantity(item.id)}
              className="bg-gray-200 w-9 h-9 rounded-lg items-center justify-center"
            >
              <Text className="text-xl font-bold">−</Text>
            </Pressable>

            <Text className="mx-4 text-lg font-bold">{item.quantity}</Text>

            <Pressable
              onPress={() => increaseQuantity(item.id)}
              className="bg-gray-200 w-9 h-9 rounded-lg items-center justify-center"
            >
              <Text className="text-xl font-bold">+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable onPress={() => removeFromCart(item.id)} className="mt-3">
        <Text className="text-red-500 font-semibold">Remove</Text>
      </Pressable>
    </View>
  );
}
