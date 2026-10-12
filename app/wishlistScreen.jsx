import { View, Text, FlatList,Pressable } from "react-native";
import { useWishlistStore } from "../store/wishlistStore";
import ProductCard from "../components/ProductCard";
import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
export default function Wishlist() {
  const wishlist = useWishlistStore((state) => state.wishlist);

return (
    
      <View className="flex-1  bg-white dark:bg-[#151718]">
        <Pressable
              onPress={() => router.back()}
              className="absolute left-5 top-12 z-10 h-10 w-10 items-center justify-center rounded-full shadow"
            >
              <Text className="text-2xl text-black dark:text-white">
                <Ionicons name="chevron-back-sharp" size={18} color="#000000" />
              </Text>
            </Pressable>
        <Text className="text-2xl  mt-10 font-bold px-10 pt-14 pb-5 text-gray-900 dark:text-white">
          My Wishlist
        </Text>

        {wishlist.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-black dark:text-white">
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
