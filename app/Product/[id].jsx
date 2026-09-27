import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/productApi";
import { useCartStore } from "../../store/cartStore";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();

  const addToCart = useCartStore((state) => state.addToCart);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-600">Loading product...</Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5">
        <Text className="text-lg font-bold text-red-500">
          Failed to load product
        </Text>
      </View>
    );
  }

  // Use the first full product image.
  // If it doesn't exist, use the thumbnail.
  const imageUrl = product.images?.[0] || product.thumbnail;

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute left-5 top-12 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow"
      >
        <Text className="text-2xl">‹</Text>
      </Pressable>

      {/* Product Image */}
      <View className="mt-10 h-[350px] items-center justify-center bg-gray-50">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="contain"
            onError={(error) => {
              console.log(
                "PRODUCT IMAGE ERROR:",
                product.id,
                product.title,
                imageUrl,
                error.nativeEvent,
              );
            }}
          />
        ) : (
          <Text className="text-gray-500">Image not available</Text>
        )}
      </View>

      {/* Product Information */}
      <View className="px-5 pt-6">
        {/* Category */}
        <Text className="mb-2 text-sm font-semibold uppercase text-pink-500">
          {product.category}
        </Text>

        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900">
          {product.title}
        </Text>

        {/* Rating */}
        <View className="mt-3 flex-row items-center">
          <Text className="text-base text-yellow-500">
            ⭐ {product.rating?.rate}
          </Text>

          <Text className="ml-2 text-sm text-gray-500">
            ({product.rating?.count} reviews)
          </Text>
        </View>

        {/* Price */}
        <Text className="mt-4 text-3xl font-bold text-black">
          ₹{product.price}
        </Text>

        {/* Description */}
        <Text className="mt-5 text-base leading-6 text-gray-600">
          {product.description}
        </Text>

        {/* Add To Cart */}
        <TouchableOpacity
          onPress={() => {
            addToCart(product);
            router.push("/(tabs)/cart");
          }}
          className="mt-8 mb-10 items-center rounded-2xl bg-pink-500 py-4"
          activeOpacity={0.7}
        >
          <Text className="text-lg font-bold text-white">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
