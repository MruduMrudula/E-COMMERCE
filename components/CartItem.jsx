import { View, Text, Pressable, Image } from "react-native";
import { useCartStore } from "../store/cartStore";
import Feather from "@expo/vector-icons/Feather";

export default function CartItem({ item }) {
   
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();

  const imageUrl = item.images?.[0] || item.thumbnail;

return (
    <View className="bg-white dark:bg-[#292929] p-4 mb-4 rounded-3xl">
      <View className="flex-row">
        <Image
          source={{ uri: imageUrl }}
          className="w-24 h-24"
          resizeMode="contain"
        />

        <View className="flex-1 ml-4">
          <Text
            className="font-semibold text-xl text-gray-900 dark:text-white"
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text className="mt-2  font-extrabold text-blue-800 dark:text-white">
            ₹{item.price}
          </Text>

          <View className="flex-row items-center mt-3">
            <Pressable
              onPress={() => decreaseQuantity(item.id)}
              className="bg-gray-200 dark:bg-gray-700 w-9 h-9 rounded-lg items-center justify-center"
            >
              <Feather name="minus" size={15} color="#2196F3" />
            </Pressable>

            <Text className="mx-4 text-lg font-bold text-gray-900 dark:text-white">
              {item.quantity}
            </Text>

            <Pressable
              onPress={() => increaseQuantity(item.id)}
              className="bg-gray-200 dark:bg-gray-700 w-9 h-9 rounded-lg items-center justify-center"
            >
              <Feather name="plus" size={15} color="#2196F3" />
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable onPress={() => removeFromCart(item.id)} className="mt-3">
        <Text className="text-red-600  text-xl dark:text-red-400 font-semibold">
          Remove
        </Text>
      </Pressable>
    </View>
  );
}

