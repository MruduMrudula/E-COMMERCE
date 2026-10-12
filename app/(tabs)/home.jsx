import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import HomeSkeleton from "../../components/HomeSkeleton";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/ProductCard";

const USER_NAME = "CARTORA";
const SIDE_PADDING = 16;
const GRID_GAP = 14;
const STICKY_OFFSET = 120;
const ACCENT = "#FF7B7B";

const BANNERS = [
  require("../../assets/image1.png"),
  require("../../assets/image2.png"),
  require("../../assets/image3.png"),
  require("../../assets/image4.png"),
  require("../../assets/image5.png"),
  require("../../assets/image6.png"),
  require("../../assets/image7.png"),
];

const CATEGORIES = [
  { id: "all", label: "All", icon: "view-grid", keywords: [] },
  {
    id: "footwear",
    label: "Footwear",
    icon: "shoe-sneaker",
    keywords: ["shoe", "footwear", "sneaker", "boot", "sandal", "slipper"],
  },
  { id: "watch", label: "Watch", icon: "watch", keywords: ["watch"] },
  {
    id: "clothing",
    label: "Clothing",
    icon: "tshirt-crew",
    keywords: ["cloth", "shirt", "jacket", "hoodie", "sweat", "dress", "jeans"],
  },
];

function SearchRow({ value, onChangeText, isDark }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1 flex-row items-center h-12 px-4 rounded-2xl bg-white dark:bg-[#292929] border border-gray-100 dark:border-gray-600">
        <TextInput
          placeholder="Search"
          placeholderTextColor={isDark ? "#9ca3af" : "#8b8aa8"}
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-sm text-indigo-950 dark:text-white"
          returnKeyType="search"
        />
        <Feather name="search" size={20} color={isDark ? "#d1d5db" : "#6b7280"} />
      </View>
      <Pressable
        onPress={() => router.push("/productScreen")}
        style={{ backgroundColor: ACCENT }}
        className="w-12 h-12 rounded-2xl items-center justify-center"
      >
        <Feather name="sliders" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

function CategoryPill({ item, active, onPress, isDark }) {
  return (
    <Pressable
      onPress={onPress}
      style={active ? { backgroundColor: ACCENT } : undefined}
      className={
        active
          ? "flex-row items-center gap-2 h-14 px-5 rounded-2xl"
          : "flex-row items-center gap-2 h-14 px-5 rounded-2xl  bg-white dark:bg-[#292929]"
      }
    >
      <MaterialCommunityIcons
        name={item.icon}
        size={26}
        color={active ? "#fff" : isDark ? "#e5e7eb" : "#1f2937"}
      />
      <Text
        className={
          active
            ? "text-sm font-semibold text-white"
            : "text-sm font-medium text-indigo-950 dark:text-white"
        }
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

export default function Home() {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const numColumns = width >= 768 ? 3 : 2;
  const bannerHeight = Math.min((width - SIDE_PADDING * 2) * 0.5, 280);

  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const flatListRef = useRef(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: products, isLoading, isError, refetch } = useProducts();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch?.();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (indexRef.current + 1) % BANNERS.length;
      indexRef.current = next;
      setActiveIndex(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const search = searchText.toLowerCase().trim();
    const category = CATEGORIES.find((c) => c.id === activeCategory);

    let list = products;
    if (category && category.keywords.length) {
      list = products.filter((product) => {
        const text = `${product.title || ""} ${product.category || ""}`.toLowerCase();
        return category.keywords.some((k) => text.includes(k));
      });
    }

    if (search) {
      return list.filter((product) => {
        const title = product.title?.toLowerCase() || "";
        const cat = product.category?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        return (
          title.includes(search) ||
          cat.includes(search) ||
          description.includes(search)
        );
      });
    }

    if (activeCategory !== "all") return list;

    const featured = products.slice(161, 165);
    return featured.length ? featured : products.slice(0, 4);
  }, [products, searchText, activeCategory]);

  if (isLoading) return <HomeSkeleton />;

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F8FC] dark:bg-[#151718]">
        <Text className="text-indigo-950 dark:text-white">
          Failed to load products
        </Text>
      </View>
    );
  }

  const Header = (
    <View>
      <View style={{ paddingTop: insets.top + 12 }} className="px-4">
        <Text className="text-2xl font-medium text-indigo-950 dark:text-white">
          Hello,
        </Text>
        <Text className="text-2xl italic font-extrabold text-pink-500 dark:text-violet-300">
          Welcome to {USER_NAME}
        </Text>
      </View>

      <View className="px-4 mt-5">
        <SearchRow
          value={searchText}
          onChangeText={setSearchText}
          isDark={isDark}
        />
      </View>

      <View className="mt-5">
        <FlatList
          ref={flatListRef}
          data={BANNERS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollToIndexFailed={() => {}}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / width);
            indexRef.current = i;
            setActiveIndex(i);
          }}
          renderItem={({ item }) => (
            <View style={{ width, paddingHorizontal: SIDE_PADDING }}>
              <Image
                source={item}
                style={{
                  width: "100%",
                  height: bannerHeight,
                  borderRadius: 18,
                }}
                resizeMode="cover"
              />
            </View>
          )}
        />

        <View className="flex-row justify-center items-center gap-2 mt-3">
          {BANNERS.map((_, i) => (
            <View
              key={i}
              style={{
                width: activeIndex === i ? 8 : 6,
                height: activeIndex === i ? 8 : 6,
                borderRadius: 4,
                backgroundColor:
                  activeIndex === i ? ACCENT : isDark ? "#4b5563" : "#d1d5db",
              }}
            />
          ))}
        </View>
      </View>

      <View className="mt-5">
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING, gap: 12 }}
          renderItem={({ item }) => (
            <CategoryPill
              item={item}
              isDark={isDark}
              active={activeCategory === item.id}
              onPress={() => setActiveCategory(item.id)}
            />
          )}
        />
      </View>

      <View className="flex-row items-center justify-between px-4 mt-6 mb-4">
        <Text className="text-2xl font-extrabold text-pink-700 dark:text-blue">
          Popular
        </Text>
        {/* <Pressable onPress={() => router.push("/productScreen")}>
          <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
            View All
          </Text>
        </Pressable> */}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F8F8FC] dark:bg-[#151718]"
    >
      <FlatList
        // key={numColumns}
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        columnWrapperStyle={{
          paddingHorizontal: SIDE_PADDING,
          gap: GRID_GAP,
          marginBottom: 18,
        }}
        contentContainerStyle={{ paddingBottom: 30 }}
        onScroll={(e) =>
          setIsSearchSticky(e.nativeEvent.contentOffset.y >= STICKY_OFFSET)
        }
        scrollEventThrottle={16}
        ListHeaderComponent={Header}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No products found
          </Text>
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

      {isSearchSticky && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            elevation: 10,
            paddingTop: insets.top + 8,
            paddingBottom: 10,
            paddingHorizontal: SIDE_PADDING,
          }}
          className="bg-[#F8F8FC] dark:bg-[#151718]"
        >
          <SearchRow
            value={searchText}
            onChangeText={setSearchText}
            isDark={isDark}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}



// best code
// import { useEffect, useMemo, useRef, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   Pressable,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   useWindowDimensions,
//   useColorScheme,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons, Feather } from "@expo/vector-icons";
// import { router } from "expo-router";
// import * as Location from "expo-location";
// import { useOrderStore } from "../../store/orderStore";

// import HomeSkeleton from "../../components/HomeSkeleton";
// import { useProducts } from "../../hooks/useProducts";
// import ProductCard from "../../components/ProductCard"
// //  const unreadOrders = useOrderStore((state) => state.unreadOrders);
// const USER_NAME = "CARTORA";
// const SIDE_PADDING = 16;
// const GRID_GAP = 14;
// const STICKY_OFFSET = 120;
 

// const BANNERS = [
//   require("../../assets/image1.png"),
//   require("../../assets/image2.png"),
//   require("../../assets/image3.png"),
//   require("../../assets/image4.png"),
//   require("../../assets/image5.png"),
//   require("../../assets/image6.png"),
//   require("../../assets/image7.png"),
// ];

// //  Small reusable pieces 

// function SearchBar({ value, onChangeText, isDark }) {
//   return (
//     <View className="flex-row items-center h-12 px-4 rounded-2xl border border-violet-200 dark:border-gray-600 bg-white dark:bg-[#292929]">
//       <Feather name="search" size={18} color={isDark ? "#c4b5fd" : "#7c3aed"} />
//       <TextInput
//         placeholder="Search"
//         placeholderTextColor={isDark ? "#9ca3af" : "#8b8aa8"}
//         value={value}
//         onChangeText={onChangeText}
//         className="flex-1 px-3 text-sm text-indigo-950 dark:text-white"
//         returnKeyType="search"
//       />
//     </View>
//   );
// }

// function GridCard({ product, index, width, isFavorite, onToggleFavorite }) {
//   const image = product.image || product.thumbnail || product.images?.[0];
//   const rating = Number(product.rating?.rate ?? product.rating ?? 0);
  

//   return (
//     <Pressable
//       style={{ width }}
//       onPress={() => router.push(`/Product/${product.id}`)}
//     >
//       <View
//         style={{ width, height: width * 1.2 }}
//         className="rounded-2xl overflow-hidden bg-gray-200 dark:bg-[#292929]"
//       >
//         {image ? (
//           <Image
//             source={{ uri: image }}
//             style={{ width: "100%", height: "100%" }}
//             resizeMode="cover"
//           />
//         ) : null}
//         {/* Heart */}
//         <Pressable
//           onPress={() => onToggleFavorite(product.id)}
//           hitSlop={8}
//           className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 items-center justify-center"
//         >
//           <Ionicons
//             name={isFavorite ? "heart" : "heart-outline"}
//             size={20}
//             color={isFavorite ? "#e11d48" : "#777"}
//           />
//         </Pressable>

        
       
//       </View>

//       {/* Info */}
//       <View className="mt-2 px-1">
//         <View className="flex-row items-center justify-between gap-2">
//           <Text
//             numberOfLines={1}
//             className="flex-1 text-base font-bold text-indigo-950 dark:text-white"
//           >
//             {product.title}
//           </Text>
//           {rating > 0 && (
//             <View className="flex-row items-center gap-1">
//               <Ionicons name="star" size={13} color="#f59e0b" />
//               <Text className="text-sm font-medium text-amber-600 dark:text-amber-400">
//                 {rating.toFixed(1)}
//               </Text>
//             </View>
//           )}
//         </View>
//         <Text className="text-sm font-semibold text-blue-600 dark:text-emerald-400 mt-0.5">
//           ₹{Number(product.price || 0).toFixed(2)}
//         </Text>
//       </View>
//     </Pressable>
//   );
// }

// //  Screen 

// export default function Home() {
//   const isDark = useColorScheme() === "dark";
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();

//   // Responsive sizes
//   const numColumns = width >= 768 ? 3 : 2;
//   const cardWidth =
//     (width - SIDE_PADDING * 2 - GRID_GAP * (numColumns - 1)) / numColumns;
//   const bannerHeight = Math.min((width - SIDE_PADDING * 2) * 0.5, 280);

//   const [refreshing, setRefreshing] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [isSearchSticky, setIsSearchSticky] = useState(false);
//   const [favorites, setFavorites] = useState([]);

//   // Carousel
//   const flatListRef = useRef(null);
//   const indexRef = useRef(0);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const { data: products, isLoading, isError, refetch } = useProducts();

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await refetch?.();
//     } finally {
//       setRefreshing(false);
//     }
//   }, [refetch]);

//   const toggleFavorite = useCallback((id) => {
//     setFavorites((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   }, []);

//   // Automatic scroll
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const next = (indexRef.current + 1) % BANNERS.length;
//       indexRef.current = next;
//       setActiveIndex(next);
//       flatListRef.current?.scrollToIndex({ index: next, animated: true });
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // Search filter
//   const filteredProducts = useMemo(() => {
//     if (!products) return [];
//     const search = searchText.toLowerCase().trim();

//     if (search) {
//       return products.filter((product) => {
//         const title = product.title?.toLowerCase() || "";
//         const category = product.category?.toLowerCase() || "";
//         const description = product.description?.toLowerCase() || "";
//         return (
//           title.includes(search) ||
//           category.includes(search) ||
//           description.includes(search)
//         );
//       });
//     }
//     const featured = products.slice(161, 165);
//     return featured.length ? featured : products.slice(0, 4);
//   }, [products, searchText]);

//   if (isLoading) return <HomeSkeleton />;

//   if (isError) {
//     return (
//       <View className="flex-1 items-center justify-center bg-[#F8F8FC] dark:bg-[#151718]">
//         <Text className="text-indigo-950 dark:text-white">
//           Failed to load products
//         </Text>
//       </View>
//     );
//   }

//   const Header = (
//     <View>
//       {/* Greeting + location */}
//       <View style={{ paddingTop: insets.top + 12 }} className="px-4">
//         <Text className="text-2xl font-medium text-indigo-950 dark:text-white">
//           Hello,
//         </Text>
//         <Text className="text-2xl  italic font-extrabold text-pink-500 dark:text-violet-300">
//          Welcome to {USER_NAME}
//         </Text>
//       </View>

//       {/* Search */}
//       <View className="px-4 mt-5">
//         <SearchBar
//           value={searchText}
//           onChangeText={setSearchText}
//           isDark={isDark}
//         />
//       </View>

//       {/* Banner carousel */}
//       <View className="mt-5">
//         <FlatList
//           ref={flatListRef}
//           data={BANNERS}
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={(_, i) => i.toString()}
//           getItemLayout={(_, index) => ({
//             length: width,
//             offset: width * index,
//             index,
//           })}
//           onScrollToIndexFailed={() => {}}
//           onMomentumScrollEnd={(e) => {
//             const i = Math.round(e.nativeEvent.contentOffset.x / width);
//             indexRef.current = i;
//             setActiveIndex(i);
//           }}
//           renderItem={({ item }) => (
//             <View style={{ width, paddingHorizontal: SIDE_PADDING }}>
//               <Image
//                 source={item}
//                 style={{
//                   width: "100%",
//                   height: bannerHeight,
//                   borderRadius: 18,
//                 }}
//                 resizeMode="cover"
//               />
//             </View>
//           )}
//         />

//         {/* Dots */}
//         <View className="flex-row justify-center items-center gap-2 mt-3">
//           {BANNERS.map((_, i) => (
//             <View
//               key={i}
//               style={{
//                 width: activeIndex === i ? 8 : 6,
//                 height: activeIndex === i ? 8 : 6,
//                 borderRadius: 4,
//               }}
//               className={
//                 activeIndex === i
//                   ? "bg-pink-500 dark:bg-violet-300"
//                   : "bg-violet-200 dark:bg-gray-600"
//               }
//             />
//           ))}
//         </View>
//       </View>

//       {/* Section title */}
//       <View className="flex-row items-center justify-between px-4 mt-6 mb-4">
//         <Text className="text-3xl font-extrabold text-[#D4AF37]">New Arrivals</Text>
//         <Pressable
//           onPress={() => router.push("/productScreen")}
//           className="flex-row items-center gap-1"
//         >
//           <Text className="font-semibold text-pink-500 dark:text-pink-400">
//             See All
//           </Text>
//           <Feather
//             name="arrow-right"
//             size={15}
//             color={isDark ? "#fb7185" : "#f43f5e"}
//           />
//         </Pressable>
//       </View>
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1 bg-[#F8F8FC] dark:bg-[#151718]"
//     >
//       <FlatList
//         key={numColumns} 
//         data={filteredProducts}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={numColumns}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//         columnWrapperStyle={{
//           paddingHorizontal: SIDE_PADDING,
//           gap: GRID_GAP,
//           marginBottom: 18,
//         }}
//         contentContainerStyle={{ paddingBottom: 30 }}
//         onScroll={(e) =>
//           setIsSearchSticky(e.nativeEvent.contentOffset.y >= STICKY_OFFSET)
//         }
//         scrollEventThrottle={16}
//         ListHeaderComponent={Header}
//         ListEmptyComponent={
//           <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">
//             No products found
//           </Text>
//         }
//         renderItem={({ item, index }) => (
        
      
//         <ProductCard
//           product={item}
//           onPress={() => router.push(`/Product/${item.id}`)}
//         />
//       )}
//         refreshing={refreshing}
//         onRefresh={onRefresh}
//       />

//       {/* Sticky search */}
//       {isSearchSticky && (
//         <View
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             zIndex: 50,
//             elevation: 10,
//             paddingTop: insets.top + 8,
//             paddingBottom: 10,
//             paddingHorizontal: SIDE_PADDING,
//           }}
//           className="bg-[#F8F8FC] dark:bg-[#151718]"
//         >
//           <SearchBar
//             value={searchText}
//             onChangeText={setSearchText}
//             isDark={isDark}
//           />
//         </View>
//       )}
//     </KeyboardAvoidingView>
//   );
// }















































































































// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   Pressable,
//   useWindowDimensions,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import HomeSkeleton from "../../components/HomeSkeleton";
// import { useProducts } from "../../hooks/useProducts";
// import * as Location from "expo-location";
// import { Ionicons } from "@expo/vector-icons";
// import Feather from "@expo/vector-icons/Feather";
// import { useOrderStore } from "../../store/orderStore";
// import ProductCard from "../../components/ProductCard";
// // import CategoryCard from "../../components/CategoryCard";
// import { router } from "expo-router";
// export default function Home() {
//   const [refreshing, setRefreshing] = useState(false);
//   const onRefresh = async () => {
//     setRefreshing(true);
//     setRefreshing(false);
//   }
//   const [locationName, setLocationName] = useState("Getting location...");
//   const unreadOrders = useOrderStore((state) => state.unreadOrders);
//   const { width } = useWindowDimensions();

//   // CAROUSEL

//   const flatListRef = useRef(null);

//   const [activeIndex, setActiveIndex] = useState(0);
  
//   const [searchText, setSearchText] = useState("");
  
//   const [isSearchSticky, setIsSearchSticky] = useState(false);

//   const banners = [
//     require("../../assets/image1.png"),
//     require("../../assets/image2.png"),
//     require("../../assets/image3.png"),
//     require("../../assets/image4.png"),
//     require("../../assets/image5.png"),
//     require("../../assets/image6.png"),
//     require("../../assets/image7.png"),
//   ];

//   //   AUTOMATIC SCROLL

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveIndex((currentIndex) => {
//         const nextIndex =
//           currentIndex === banners.length - 1 ? 0 : currentIndex + 1;

//         flatListRef.current?.scrollToIndex({
//           index: nextIndex,
//           animated: true,
//         });

//         return nextIndex;
//       });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);
//   useEffect(() => {
//     const getLocation = async () => {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();

//         if (status !== "granted") {
//           setLocationName("Location unavailable");
//           return;
//         }

//         const location = await Location.getCurrentPositionAsync({
//           accuracy: Location.Accuracy.Balanced,
//         });

//         const { latitude, longitude } = location.coords;

//         const address = await Location.reverseGeocodeAsync({
//           latitude,
//           longitude,
//         });

//         if (address.length > 0) {
//           const place = address[0];

//           const area =
//             place.district ||
//             place.subregion ||
//             place.city ||
//             "Current Location";

//           const city = place.city || place.subregion || place.region || "";

//           setLocationName(city && area !== city ? `${area}, ${city}` : area);
//         }
//       } catch (error) {
//         console.log("LOCATION ERROR:", error);
//         setLocationName("Location unavailable");
//       }
//     };

//     getLocation();
//   }, []);
//   const { data: products, isLoading, isError } = useProducts();

//   if (isLoading) {
//     return (
//       <HomeSkeleton />
//     );
//   }

//   if (isError) {
//     return (
//       <View>
//         <Text>Failed to load products</Text>
//       </View>
//     );
//   }

//   const filteredProducts = searchText.trim()
//     ? products?.filter((product) => {
//         const search = searchText.toLowerCase().trim();

//         const title = product.title?.toLowerCase() || "";
//   const category = product.category?.toLowerCase() || "";
//   const description = product.description?.toLowerCase() || "";

// return (
//   title.includes(search) ||
//     category.includes(search) ||
//     description.includes(search) );
//   }):products?.slice(161, 165);
// return (
//   <KeyboardAvoidingView
//     behavior={Platform.OS === "ios" ? "padding" : "height"}
//     className="flex-1 bg-white dark:bg-[#151718]"
//   >
//     <FlatList
//       data={filteredProducts}
//       keyExtractor={(item) => item.id.toString()}
//       showsHorizontalScrollIndicator={false}
//       numColumns={2}
//       columnWrapperStyle={{ paddingHorizontal: 8 }}
//       contentContainerStyle={{ paddingBottom: 20 }}
//       // ADDED FOR STICKY SEARCH

//       onScroll={(event) => {
//         const scrollY = event.nativeEvent.contentOffset.y;

//         setIsSearchSticky(scrollY >= 10);
//       }}
//       scrollEventThrottle={16}
//       ListHeaderComponent={
//         <View>
//           {/* CAROUSEL */}
//           <View
//             style={{
//               width: "90%",
//               position: "relative",
//             }}
//           >
//             {/* Search */}
//             <View className="px-5 mt-10">
//               <View className="bg-white dark:bg-[#292929] rounded-3xl p-3 flex-row items-center shadow-lg border border-gray-100 dark:border-gray-700">
//                 <View className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 items-center justify-center">
//                   <Ionicons name="search-outline" size={25} color="#111" />
//                 </View>

//                 <TextInput
//                   placeholder='Search for "Handbags"'
//                   placeholderTextColor="#64748b"
//                   value={searchText}
//                   onChangeText={setSearchText}
//                   className="flex-1 px-4 text-base text-black dark:text-white"
//                 />
//               </View>
//             </View>

//             <FlatList
//               ref={flatListRef}
//               data={banners}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               keyExtractor={(_, index) => index.toString()}
//               getItemLayout={(data, index) => ({
//                 length: width,
//                 offset: width * index,
//                 index,
//               })}
//               onMomentumScrollEnd={(event) => {
//                 const index = Math.round(
//                   event.nativeEvent.contentOffset.x / width,
//                 );

//                 setActiveIndex(index);
//               }}
//               renderItem={({ item }) => (
//                 <View
//                   style={{
//                     width: width,
//                     height: width * 0.9,
//                   }}
//                 >
//                   <Image
//                     source={item}
//                     style={{
//                       width: width * 0.9,
//                       height: width * 0.9,
//                       marginTop: 30,
//                       alignSelf: "center",
//                     }}
//                     resizeMode="contain"
//                   />
//                 </View>
//               )}
//             />

//             {/* CAROUSEL DOTS */}
//             <View
//               style={{
//                 position: "absolute",
//                 bottom: width * 0.10,
//                 left: 0,
//                 right: 0,
//                 flexDirection: "row",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 gap: 8,
//               }}
//             >
//               {banners.map((_, index) => (
//                 <View
//                   key={index}
//                   style={{
//                     width: activeIndex === index ? 6 : 3,
//                     height: 5,
//                     borderRadius: 10,
//                     backgroundColor:
//                       activeIndex === index ? "white" : "#cccccc",
//                   }}
//                 />
//               ))}
//             </View>
//           </View>

//           {/* PRODUCTS TITLE */}
//           <View className="flex-row items-center justify-between px-5 mt-0 mb-4">
//             <Text className="text-2xl font-bold text-[#D4AF37]">
//               New Arrivals
//             </Text>

//             <Pressable onPress={() => router.push("/productScreen")}>
//               <Text              className="font-semibold text-pink-500 dark:text-pink-400">
//                 See All <Feather name="arrow-right" size={15} color="#EC4899" />
//               </Text>
//             </Pressable>
//           </View>
//         </View>
//       }
//       renderItem={({ item }) => (
//         <ProductCard
//           product={item}
//           onPress={() => router.push(`/Product/${item.id}`)}
//         />
//       )}
//       refreshing={refreshing}
//       onRefresh={onRefresh}
//     />

//     {/* STICKY SEARCH */}
//     {isSearchSticky && (
//       <View
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 9999,
//           elevation: 9999,
//           backgroundColor: "#FDF0F3",
//           paddingTop: 10,
//           paddingBottom: 10,
//         }}
//       >
//         <View className="px-5">
//           <View className="bg-white dark:bg-[#292929] rounded-3xl p-3 flex-row items-center shadow-lg border border-gray-100 dark:border-gray-700">
//             <View className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 items-center justify-center">
//               <Ionicons name="search-outline" size={25} color="#111" />
//             </View>

//             <TextInput
//               placeholder='Search for "Handbags"'
//               placeholderTextColor="#64748b"
//               value={searchText}
//               onChangeText={setSearchText}
//               className="flex-1 px-4 text-base text-black dark:text-white"
//             />
//           </View>
//         </View>
//       </View>
//     )}
//   </KeyboardAvoidingView>
// );
// }














