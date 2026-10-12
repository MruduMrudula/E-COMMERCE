import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/productApi";
import { useCartStore } from "../../store/cartStore";
import ProductSkeleton from "../../components/productSkeleton";
export default function ProductDetails() {
  const [review, setReview] = useState("");
const [reviews, setReviews] = useState([]);
const removeReview = (reviewId) => {
  setReviews((prev) => prev.filter((item) => item.id !== reviewId));
};
const [selectedRating, setSelectedRating] = useState(0);

  const { id } = useLocalSearchParams();

  const addToCart = useCartStore((state) => state.addToCart);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

 
  if (isLoading) {
    return <ProductSkeleton />;
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

 
  const imageUrl = product.images?.[0] || product.thumbnail;

return (
  <ScrollView
    className="flex-1  bg-white dark:bg-[#151718]"
    showsVerticalScrollIndicator={false}
  >
    {/* Back Button */}
    <Pressable
      onPress={() => router.back()}
      className="absolute left-5 top-12 z-10 h-10 w-10 items-center justify-center rounded-full shadow"
    >
      <Text className="text-2xl text-black dark:text-white">‹</Text>
    </Pressable>

    {/* Product Image */}
    <View className="mt-10 h-[300px] items-center justify-center bg-white dark:bg-[#292929]">
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
        <Text className="text-black dark:text-white">Image not available</Text>
      )}
    </View>

    {/* Product Information */}
    <View className="px-5 pt-6">
      {/* Category */}
      <Text className="mb-2 text-sm font-semibold uppercase text-pink-500">
        {product.category}
      </Text>
      {/* Title */}
      <Text className="text-2xl font-bold text-black dark:text-white">
        {product.title}
      </Text>
      {/* Rating */}
      <View className="mt-3 flex-row items-center">
        {/* Price */}
        <Text className="mt-4 text-3xl font-bold text-blue-500 dark:text-white">
          ₹{product.price}
        </Text>
      </View>
      <Text className="ml-2  font-semibold text-ml text-black dark:text-gray-500">
        {product.rating?.count}Rate this product
      </Text>
      
      <View className="mb-4 flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setSelectedRating(star)}>
            <Ionicons
              name={star <= selectedRating ? "star" : "star-outline"}
              size={28}
              color="#FACC15"
            />
          </Pressable>
        ))}
      </View>
      {reviews.map((item) => (
        <View
          key={item.id}
          className="mt-5 rounded-xl bg-gray-100 p-4 dark:bg-[#292929]"
        >
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= item.rating ? "star" : "star-outline"}
                size={16}
                color="#FACC15"
              />
            ))}
          </View>

          <Text className="mt-2 text-black dark:text-white">{item.text}</Text>
          <Pressable
            onPress={() => removeReview(item.id)}
            className="mt-3 self-start rounded-lg bg-red-500 px-4 py-2"
          >
            <Text className="font-bold text-white">Remove Review</Text>
          </Pressable>
        </View>
      ))}
      {/* Description */}
      <Text className="mt-2 text-base leading-6 text-black dark:text-gray-300">
        {product.description}
      </Text>
      <TextInput
        value={review}
        onChangeText={setReview}
        placeholder="Write your review..."
        placeholderTextColor="#9CA3AF"
        multiline
        className="mb-3 rounded-xl border border-gray-300 bg-white px-2 py-2 text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
        style={{
          minHeight: 0,
          textAlignVertical: "top",
        }}
      />
      <Pressable
        onPress={() => {
          if (!review.trim() || selectedRating === 0) {
            return;
          }
          const newReview = {
            id: Date.now().toString(),
            text: review,
            rating: selectedRating,
          };

          setReviews((prev) => [newReview, ...prev]);

          setReview("");
          setSelectedRating(0);
        }}
        className="items-center rounded-xl bg-pink-500 py-3"
      >
        <Text className="font-bold text-white">Submit Review</Text>
      </Pressable>
      {/* Add To Cart */}
      <TouchableOpacity
        onPress={() => {
          addToCart(product);
          router.push("/(tabs)/cart");
        }}
        className="mt-8 mb-10 items-center rounded-2xl bg-red-500 dark:bg-pink-600 py-4"
        activeOpacity={0.7}
      >
        <Text className="text-lg font-bold text-white">Add to Cart</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);
}


