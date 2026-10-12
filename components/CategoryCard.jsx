import { View, Text, Image, Pressable } from "react-native";
export default function CategoryCard({
  title,
  image,
  height,
  fullWidth = false,
}) {
  return (
    <Pressable
      className={`bg-white rounded-3xl border border-gray-200 overflow-hidden mb-4 ${
        fullWidth ? "w-full" : ""
      }`}
      style={{
        height: height,
      }}
    >
      {/* Title */}
      <View className="absolute top-5 left-0 right-0 z-10 items-center">
        <Text className="text-xl font-bold text-gray-900 text-center">
          {title}
        </Text>
      </View>

      {/* Image */}
      <Image source={image} className="w-full h-full" resizeMode="cover" />
    </Pressable>
  );
}
