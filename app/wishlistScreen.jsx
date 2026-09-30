import { View, Text, FlatList } from "react-native";
import { useWishlistStore } from "../store/wishlistStore";
import ProductCard from "../components/ProductCard";
import { router } from "expo-router";

export default function Wishlist() {
  const wishlist = useWishlistStore((state) => state.wishlist);

  return (
    <View className="flex-1 bg-white">
      <Text className="text-2xl font-bold px-5 pt-14 pb-5">My Wishlist</Text>

      {wishlist.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">
            Your wishlist is empty ❤️
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{ paddingHorizontal: 8 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/Product/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}
