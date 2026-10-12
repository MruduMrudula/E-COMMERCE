import { View } from "react-native";

export default function HomeSkeleton() {
  return (
    <View className="flex-1 bg-white dark:bg-[#151718]">
      {/* Carousel Skeleton */}
      <View className="h-[400px] w-full bg-gray-200 dark:bg-[#292929]" />

      {/* Search Skeleton */}
      <View className="-mt-14 px-5">
        <View className="h-[70px] w-full rounded-3xl bg-gray-200 dark:bg-gray-700" />
      </View>

      {/* New Arrivals */}
      <View className="mt-7 px-5">
        <View className="h-7 w-40 rounded bg-gray-200 dark:bg-gray-700" />
      </View>

      {/* Product Skeletons */}
      <View className="mt-5 flex-row flex-wrap px-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} className="mb-4 w-1/2 px-2">
            <View className="h-52 w-full rounded-2xl bg-gray-200 dark:bg-gray-700" />

            <View className="mt-3 h-5 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />

            <View className="mt-2 h-5 w-2/5 rounded bg-gray-200 dark:bg-gray-700" />
          </View>
        ))}
      </View>
    </View>
  );
}
