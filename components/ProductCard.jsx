import { View, Text, Image, Pressable } from "react-native";
import { useWishlistStore } from "../store/wishlistStore";
import { Ionicons } from "@expo/vector-icons";
export default function ProductCard({ product, onPress })
 {
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const wishlist = useWishlistStore((state) => state.wishlist);

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  return (
    <Pressable onPress={onPress} className="w-1/2 px-2 mb-4">
      <View className="bg-[#FFF1E6] rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        {/* Product Image */}
        <View className="h-48 bg-gray-50 items-center justify-center">
          <Image
            source={{ uri: product.thumbnail || product.images?.[0] }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        {/* heart icon */}
        <Pressable
          onPress={() => toggleWishlist(product)}
          className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white items-center justify-center"
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={20}
            color={isWishlisted ? "#EC4899" : "#555"}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

