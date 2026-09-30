import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  useWindowDimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useProducts } from "../../hooks/useProducts";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";

import ProductCard from "../../components/ProductCard";
// import CategoryCard from "../../components/CategoryCard";
import { router } from "expo-router";
export default function Home() {
  const [locationName, setLocationName] = useState("Getting location...");
  const { width } = useWindowDimensions();

  // CAROUSEL

  const flatListRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  
  const [searchText, setSearchText] = useState("");
  
  const [isSearchSticky, setIsSearchSticky] = useState(false);

  const banners = [
    require("../../assets/image1.png"),
    require("../../assets/image2.png"),
    require("../../assets/image3.png"),
    require("../../assets/image4.png"),
    require("../../assets/image5.png"),
    require("../../assets/image6.png"),
    require("../../assets/image7.png"),
  ];

  //   AUTOMATIC SCROLL

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex =
          currentIndex === banners.length - 1 ? 0 : currentIndex + 1;

        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationName("Location unavailable");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = location.coords;

        const address = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (address.length > 0) {
          const place = address[0];

          const area =
            place.district ||
            place.subregion ||
            place.city ||
            "Current Location";

          const city = place.city || place.subregion || place.region || "";

          setLocationName(city && area !== city ? `${area}, ${city}` : area);
        }
      } catch (error) {
        console.log("LOCATION ERROR:", error);
        setLocationName("Location unavailable");
      }
    };

    getLocation();
  }, []);
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>
          Loading products...
          <ActivityIndicator size="large" />
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>Failed to load products</Text>
      </View>
    );
  }

  const filteredProducts = products?.filter((product) => {
    const search = searchText.toLowerCase().trim();

    const title = product.title?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";

    const matchesSearch =
      !search ||
      title.includes(search) ||
      category.includes(search) ||
      description.includes(search);

    return matchesSearch;
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <LinearGradient
        //  colors={["#FDF0F3", "#FFFBFC"]}
        //  colors={["#FCE7F3", "#E9D5FF"]}
        colors={["#292929", "#4A4A4A"]}
        style={{
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 5,
        }}
      >
        <FlatList
          data={filteredProducts?.slice(161, 166)}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          numColumns={3}
          columnWrapperStyle={{ paddingHorizontal: 8 }}
          contentContainerStyle={{ paddingBottom: 30 }}
          // ADDED FOR STICKY SEARCH
          onScroll={(event) => {
            const scrollY = event.nativeEvent.contentOffset.y;

            setIsSearchSticky(scrollY >= width * 1.15 - 20);
          }}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <View>
              {/* CAROUSEL */}
              <View
                style={{
                  width: "90%",
                  position: "relative",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 5,
                    left: 20,
                    right: 10,
                    zIndex: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* PROFILE */}
                  <Pressable
                    onPress={() => router.push("/(tabs)/profile")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: "#292929",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="person-outline" size={27} color="white" />
                  </Pressable>

                  {/* LOCATION */}
                  <Pressable
                    onPress={() => router.push("/location")}
                    style={{
                      flex: 1,
                      marginHorizontal: 12,
                      height: 52,
                      marginTop: 0,
                      borderRadius: 28,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 12,
                      elevation: 8,
                      backgroundColor: "#292929",
                    }}
                  >
                    <Ionicons name="chevron-down" size={32} color="#8B0000" />

                    <View style={{ marginLeft: 7 }}>
                      <Text
                        style={{
                          fontSize: 11,
                          color: "gray",
                          fontWeight: "600",
                        }}
                      >
                        YOUR LOCATION
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 14,
                          color: "white",
                          fontWeight: "700",
                          maxWidth: 150,
                        }}
                      >
                        {locationName}
                      </Text>
                    </View>
                  </Pressable>

                  {/* LIKE BUTTON */}
                  <Pressable
                    onPress={() => router.push("/wishlistScreen")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: "#292929",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="heart" size={32} color="#8B0000" />
                  </Pressable>
                </View>

                <FlatList
                  ref={flatListRef}
                  data={banners}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_, index) => index.toString()}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x / width,
                    );

                    setActiveIndex(index);
                  }}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        width: width,
                        height: width * 1.15,
                      }}
                    >
                      <Image
                        source={item}
                        style={{
                          width: 350,
                          height: 350,
                          marginTop: 50,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                />

                {/* CAROUSEL DOTS */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 100,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {banners.map((_, index) => (
                    <View
                      key={index}
                      style={{
                        width: activeIndex === index ? 6 : 3,
                        height: 8,
                        borderRadius: 10,
                        backgroundColor:
                          activeIndex === index ? "white" : "#cccccc",
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* SEARCH */}
              <View className="px-5 mt-[-55]">
                <View className="bg-white rounded-3xl p-3 flex-row items-center shadow-lg border border-gray-100">
                  <View className="w-12 h-12 rounded-2xl bg-gray-100 items-center justify-center">
                    <Ionicons name="search-outline" size={25} color="#111" />
                  </View>

                  <TextInput
                    placeholder='Search for "Handbags"'
                    placeholderTextColor="#64748b"
                    value={searchText}
                    onChangeText={setSearchText}
                    className="flex-1 px-4 text-base"
                  />
                </View>
              </View>

              {/* PRODUCTS TITLE */}
              <View className="flex-row items-center justify-between px-5 mt-6 mb-4">
                <Text
                  className="text-2xl font-bold"
                  style={{ color: "#D4AF37" }}
                >
                  New Arrivals
                </Text>

                <Pressable onPress={() => router.push("/productScreen")}>
                  <Text className="font-semibold text-pink-500">
                    See All{" "}
                    <Feather name="arrow-right" size={15} color="#EC4899" />
                  </Text>
                </Pressable>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/Product/${item.id}`)}
            />
          )}
        />

        {/* ADDED FOR STICKY SEARCH */}
        {isSearchSticky && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 15,
              right: 15,
              zIndex: 100,
              backgroundColor: "#FDF0F3",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <View className="px-5">
              <View className="bg-white rounded-3xl p-3 flex-row items-center shadow-lg border border-gray-100">
                <View className="w-12 h-12 rounded-2xl bg-gray-100 items-center justify-center">
                  <Ionicons name="search-outline" size={25} color="#111" />
                </View>

                <TextInput
                  placeholder='Search for "Handbags"'
                  placeholderTextColor="#64748b"
                  value={searchText}
                  onChangeText={setSearchText}
                  className="flex-1 px-4 text-base"
                />
              </View>
            </View>
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}


































//  CATEGORIES

//       <View className="px-5 mt-8">
//         <View className="flex-row gap-4">
//           {/* LEFT COLUMN */}

//           <View className="flex-1">
//             <CategoryCard
//               title="Fashion"
//               image={require("../../assets/image2.png")}
//               height={340}
//             />

//             <CategoryCard
//               title="Beauty"
//               image={require("../../assets/image3.png")}
//               height={180}
//             />
//           </View>

//           {/* RIGHT COLUMN */}

//           <View className="flex-1">
//             <CategoryCard
//               title="Jewellery"
//               image={require("../../assets/image4.png")}
//               height={190}
//             />

//             <CategoryCard
//               title="Footwear"
//               image={require("../../assets/image5.png")}
//               height={190}
//             />
//           </View>
//         </View>

//         <CategoryCard
//           title="Bags & Accessories"
//           image={require("../../assets/image1.png")}
//           height={360}
//           fullWidth
//         />

//         <CategoryCard
//           title="Decor"
//           image={require("../../assets/image2.png")}
//           height={220}
//           fullWidth
//         />
//       </View>

//       <View className="h-10" />
