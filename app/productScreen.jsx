import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

export default function ProductScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const categories = ["All", "beauty", "fragrances", "furniture", "groceries"];

  const { data: products, isLoading, isError } = useProducts();

  const filteredProducts = products?.filter((product) => {
    const category = product.category?.toLowerCase() || "";

    return (
      selectedCategory === "All" || category === selectedCategory.toLowerCase()
    );
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#151718]">
        <Text className="text-black dark:text-white">Loading products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#151718]">
        <Text className="text-black dark:text-white">
          Failed to load products
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-[#151718]">
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{
          paddingHorizontal: 8,
        }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View>
            {/* HEADER */}

            <View className="px-5 pt-14 pb-4">
              <Text className="text-2xl  font-bold text-pink-500 dark:text-white">
                All Products
              </Text>
            </View>

            {/* HORIZONTAL CATEGORIES */}

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 18,
              }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedCategory(item)}
                  className={`mr-3 rounded-full px-5 py-3 ${
                    selectedCategory === item
                      ? "bg-pink-500 dark:bg-pink-600"
                      : "bg-gray-100 dark:bg-[#292929]"
                  }`}
                >
                  <Text
                    className={`font-extrabold italic ${
                      selectedCategory === item
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/Product/${item.id}`)}
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   Pressable,
//   useWindowDimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useProducts } from "../hooks/useProducts";

// function GridCard({ product, width, onPress }) {
//   const image = product.image || product.thumbnail || product.images?.[0];
//   const rating = Number(product.rating?.rate ?? product.rating ?? 0);
//   const badge = product.badge;

//   return (
//     <Pressable
//       style={{ width, borderWidth: 0.5 }}
//       className="bg-white dark:bg-[#1c1c1e] border-gray-200 dark:border-gray-700"
//       onPress={onPress}
//     >
//       <View className="flex-row items-center justify-between px-4 pt-5">
//         <Text
//           numberOfLines={1}
//           className="flex-1 text-base font-medium uppercase text-black dark:text-white"
//         >
//           {product.title}
//         </Text>
//         {badge ? (
//           <View className="ml-2 px-3 py-1 rounded-full border border-orange-700">
//             <Text className="text-[10px] font-medium uppercase text-orange-700">
//               {badge}
//             </Text>
//           </View>
//         ) : null}
//       </View>

//       <View
//         style={{ width, height: width * 0.85, padding: 16 }}
//         className="items-center justify-center"
//       >
//         {image ? (
//           <Image
//             source={{ uri: image }}
//             style={{ width: "100%", height: "100%" }}
//             resizeMode="contain"
//           />
//         ) : null}
//       </View>

//       <View className="px-4 pb-4 flex-row items-center justify-between">
//         <Text className="text-sm font-semibold text-blue-500 dark:text-white">
//           ₹{Number(product.price || 0).toFixed(2)}
//         </Text>
//         {rating > 0 && (
//           <View className="flex-row items-center gap-1">
//             <Ionicons name="star" size={13} color="#f59e0b" />
//             <Text className="text-sm font-medium text-amber-600 dark:text-amber-400">
//               {rating.toFixed(1)}
//             </Text>
//           </View>
//         )}
//       </View>
//     </Pressable>
//   );
// }

// export default function productScreen() {
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const { width } = useWindowDimensions();
//   const numColumns = 2;
//   const cardWidth = width / numColumns;

//   const onRefresh = async () => {
//     setRefreshing(true);
//     setRefreshing(false);
//   };

//   const categories = ["All", "beauty", "fragrances", "furniture", "groceries"];

//   const { data: products, isLoading, isError } = useProducts();

//   const filteredProducts = products?.filter((product) => {
//     const category = product.category?.toLowerCase() || "";

//     return (
//       selectedCategory === "All" || category === selectedCategory.toLowerCase()
//     );
//   });

//   if (isLoading) {
//     return (
//       <View className="flex-1 items-center justify-center bg-white dark:bg-[#151718]">
//         <Text className="text-black dark:text-white">Loading products...</Text>
//       </View>
//     );
//   }

//   if (isError) {
//     return (
//       <View className="flex-1 items-center justify-center bg-white dark:bg-[#151718]">
//         <Text className="text-black dark:text-white">
//           Failed to load products
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-white dark:bg-[#151718]">
//       <FlatList
//         key={numColumns}
//         data={filteredProducts}
//         numColumns={numColumns}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         stickyHeaderIndices={[0]}
//         ListHeaderComponent={
//           <View>
//             {/* HEADER */}

//             <View className="px-5 pt-14 pb-4">
//               <Text className="text-2xl  font-bold text-pink-500 dark:text-white">
//                 All Products
//               </Text>
//             </View>

//             {/* HORIZONTAL CATEGORIES */}

//             <FlatList
//               data={categories}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               keyExtractor={(item) => item}
//               contentContainerStyle={{
//                 paddingHorizontal: 20,
//                 paddingBottom: 18,
//               }}
//               renderItem={({ item }) => (
//                 <Pressable
//                   onPress={() => setSelectedCategory(item)}
//                   className={`mr-3 rounded-full px-5 py-3 ${
//                     selectedCategory === item
//                       ? "bg-pink-500 dark:bg-pink-600"
//                       : "bg-gray-100 dark:bg-[#292929]"
//                   }`}
//                 >
//                   <Text
//                     className={`font-extrabold italic ${
//                       selectedCategory === item
//                         ? "text-white"
//                         : "text-gray-700 dark:text-gray-200"
//                     }`}
//                   >
//                     {item}
//                   </Text>
//                 </Pressable>
//               )}
//             />
//           </View>
//         }
//         renderItem={({ item }) => (
//           <GridCard
//             product={item}
//             width={cardWidth}
//             onPress={() => router.push(`/Product/${item.id}`)}
//           />
//         )}
//         refreshing={refreshing}
//         onRefresh={onRefresh}
//       />
//     </View>
//   );
// }