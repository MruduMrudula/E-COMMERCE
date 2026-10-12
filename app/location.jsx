
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LocationScreen() {
  const [address, setAddress] = useState("Getting location...");
  const [loading, setLoading] = useState(true);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setAddress("Location permission denied");
        setLoading(false);
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const { latitude, longitude } = currentLocation.coords;

      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result.length > 0) {
        const place = result[0];

        const area =
          place.district ||
          place.subregion ||
          place.city ||
          "";

        const city =
        place.city ||
          place.region ||
"";

        setAddress(
          area && city && area !== city
            ? `${area}, ${city}`
            : city || area || "Current Location"
        );
      }
    } catch (error) {
      console.log("LOCATION ERROR:", error);
      setAddress("Unable to get location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadLocation = async () => {
      await getCurrentLocation();
    };

    loadLocation();
  }, []);

  const handleSelectLocation = () => {
    router.back();
  };

  return (
    <View className="flex-1">
      {/* HEADER */}
      <View className="flex-row items-center px-5 pt-14 pb-5">
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 items-center justify-center rounded-full "
        >
          <Ionicons name="arrow-back" size={25} color="black" />
        </Pressable>

        <Text className="ml-4 text-xl font-bold text-black">
          Select Location
        </Text>
      </View>

      {/* LOCATION AREA */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-pink-100">
          <Ionicons name="location" size={55} color="#ec4899" />
        </View>

        <Text className="mt-2 text-lg text-black">Your Current Location</Text>

        {loading ? (
          <>
            <ActivityIndicator size="large" color="#ec4899" className="mt-5" />

            <Text className="mt-2 text-black">Getting your location...</Text>
          </>
        ) : (
          <Text className="mb-5 text-center text-2xl font-bold text-black">
            {address}
          </Text>
        )}
      </View>

      {/* BOTTOM CARD */}
      <View className="rounded-t-3xl  p-5">
        <View className="flex-row items-center">
          <View className="h-12 w-12   items-center justify-center rounded-full bg-pink-100">
            <Ionicons name="location" size={25} color="#ec4899" />
          </View>

          <View className="ml-3  flex-1">
            <Text className="text-sm text-black">Selected Location</Text>

            <Text
              className="mt-0 text-base font-bold text-black"
              numberOfLines={2}
            >
              {address}
            </Text>
          </View>
        </View>
        {/* USE CURRENT LOCATION */}
        <Pressable
          onPress={getCurrentLocation}
          className="mt-10 flex-row mb-5 items-center justify-center rounded-xl border border-gray-300 py-3"
        >
          <Ionicons name="locate" size={20} color="#ec4899" />

          <Text className="ml-2  font-semibold text-pink-500">
            Use Current Location
          </Text>
        </Pressable>
        {/* CONFIRM */}
        <Pressable
          onPress={handleSelectLocation}
          className="  mb-40 items-center rounded-xl bg-pink-500 py-4"
        >
          <Text className="text-lg font-bold text-white">Confirm Location</Text>
        </Pressable>
        
      </View>
    </View>
  );
}
