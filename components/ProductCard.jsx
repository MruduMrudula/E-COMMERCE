// import { View, Text, Image, Pressable } from "react-native";
// import { useWishlistStore } from "../store/wishlistStore";
// import { Ionicons } from "@expo/vector-icons";
// export default function ProductCard({ product, onPress })
//  {
//   const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

//   const wishlist = useWishlistStore((state) => state.wishlist);

//   const isWishlisted = wishlist.some((item) => item.id === product.id);
//   return (
//     <Pressable onPress={onPress} className="w-1/2 px-2 mb-4">
//       <View className="bg-white  rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
//         <View className="p-3 bg-white">
//           <Text
//             className="font-semibold text-center text-base text-black"
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {product.title.toUpperCase()}
//             {/* {product.title.split(" ")[1].toUpperCase()} */}
//           </Text>

//           {/* <Text className="mt-2  font-extrabold text-blue-600">
//             ₹{product.price}
//           </Text> */}
//         </View>
//         {/* Product Image */}

//         <View className="h-48 bg-gray-50 items-center justify-center">
//           <Image
//             source={{ uri: product.thumbnail || product.images?.[0] }}
//             className="w-full h-full"
//             resizeMode="contain"
//           />
//         </View>

//         {/* heart icon */}
//         <Pressable
//           onPress={() => toggleWishlist(product)}
//           className="absolute left-3 bottom-3 w-9 h-9 rounded-full   "
//         >
//           <Ionicons
//             name={isWishlisted ? "heart" : "heart-outline"}
//             size={20}
//             color={isWishlisted ? "red" : "red"}
//           />
//         </Pressable>
//       </View>
//     </Pressable>
//   );
// }

import { View, Text, Image, Pressable, useColorScheme } from "react-native";
import { useWishlistStore } from "../store/wishlistStore";
import { Ionicons } from "@expo/vector-icons";

export default function ProductCard({ product, onPress, numColumns = 2 }) {
  const isDark = useColorScheme() === "dark";

  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const wishlist = useWishlistStore((state) => state.wishlist);

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const rating = Number(product.rating?.rate ?? product.rating ?? 0);

  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, maxWidth: `${100 / numColumns}%`, borderWidth: 0.5 }}
      className="bg-white dark:bg-[#1c1c1e] border-gray-200 dark:border-gray-700"
    >
      <View className="px-4 pt-5">
        <Text
          className="font-medium text-base text-black dark:text-white"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {product.title.toUpperCase()}
        </Text>
      </View>

      {/* Product Image */}

      <View
        style={{ width: "100%", aspectRatio: 1.18, padding: 16 }}
        className="items-center justify-center"
      >
        <Image
          source={{ uri: product.thumbnail || product.images?.[0] }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />

        {/* heart icon */}
        <Pressable
          onPress={() => toggleWishlist(product)}
          hitSlop={8}
          className="absolute right-3 bottom-2 w-8 h-8 rounded-full items-center justify-center"
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={24}
            color={isWishlisted ? "#e11d48" : isDark ? "#9ca3af" : "#777"}
          />
        </Pressable>
      </View>

      <View className="px-4 pb-4 flex-row items-center justify-between">
        <Text className="text-base font-medium text-black dark:text-white">
          ₹{Number(product.price || 0).toFixed(2)}
        </Text>
        {rating > 0 && (
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text className="text-base font-medium text-gray-500 dark:text-gray-400">
              {rating.toFixed(1)}
            </Text>
            </View>
        )}
        </View>
        </Pressable>
  );
}
        