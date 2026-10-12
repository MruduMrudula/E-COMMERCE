import { View } from "react-native";

export default function ProductSkeleton() {
  return (
    <View className="flex-1 bg-white dark:bg-[#151718]">
      {/* Product Image */}
      <View className="mt-10 h-[300px] w-full bg-gray-200 dark:bg-[#292929]" />

      {/* Product Information */}
      <View className="px-5 pt-6">
        {/* Category */}
        <View className="mb-3 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />

        {/* Title */}
        <View className="h-7 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />

        {/* Price */}
        <View className="mt-5 h-9 w-32 rounded bg-gray-200 dark:bg-gray-700" />

        {/* Rating */}
        <View className="mt-4 h-6 w-28 rounded bg-gray-200 dark:bg-gray-700" />

        {/* Description */}
        <View className="mt-6 h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <View className="mt-2 h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <View className="mt-2 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

        {/* Review Input */}
        <View className="mt-6 h-24 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />

        {/* Submit Review */}
        <View className="mt-3 h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />

        {/* Add To Cart */}
        <View className="mt-8 mb-10 h-14 w-full rounded-2xl bg-gray-200 dark:bg-gray-700" />
      </View>
    </View>
  );
}
