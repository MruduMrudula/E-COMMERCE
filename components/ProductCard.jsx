import { View, Text, Image, Pressable } from "react-native";

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable onPress={onPress} className="w-1/2 px-2 mb-4">
      <View className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        {/* Product Image */}
        <View className="h-48 bg-gray-50 items-center justify-center">
          <Image
            source={{ uri: product.thumbnail || product.images?.[0] }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        {/* Product Information */}
      </View>
    </Pressable>
  );
}

