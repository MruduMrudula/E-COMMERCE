import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import { Ionicons } from "@expo/vector-icons";

export default function Products() {
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

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
      <View className="flex-1 items-center justify-center">
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Failed to load products</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{
          paddingHorizontal: 8,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* HEADER */}
            <View className="flex-row items-center justify-between px-5 pt-14 pb-5">
              <Text className="text-2xl font-bold">All Products</Text>

              <Pressable
                onPress={() => {
                  console.log("MENU CLICKED");
                  setShowCategories((previous) => !previous);
                }}
                className="w-10 h-10 rounded-full bg-white items-center justify-center"
              >
                <Ionicons name="menu-outline" size={26} color="black" />
              </Pressable>
            </View>

            {/* CATEGORIES */}
            {showCategories && (
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: 15,
                }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setSelectedCategory(item);
                      setShowCategories(false);
                    }}
                    className={`px-5 py-3 rounded-full mr-3 ${
                      selectedCategory === item
                        ? "bg-black"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        selectedCategory === item
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/Product/${item.id}`)}
          />
        )}
      />
    </View>
  );
}
