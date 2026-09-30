import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Getting location...");
  const [loading, setLoading] = useState(true);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setAddress("Location permission denied");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      setLocation({
        latitude,
        longitude,
      });

      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result.length > 0) {
        const place = result[0];

        const area = place.district || place.subregion || place.city || "";

        const city = place.city || place.region || "";

        setAddress(
          area && city && area !== city
            ? `${area}, ${city}`
            : city || area || "Current Location",
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
    getCurrentLocation();
  }, []);

  const handleSelectLocation = () => {
    router.back();
  };

  if (!location) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />

        <Text className="mt-4 text-gray-600">Getting your location...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="absolute left-5 right-5 top-12 z-10 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 items-center justify-center rounded-full bg-white"
          style={{ elevation: 8 }}
        >
          <Ionicons name="arrow-back" size={25} color="black" />
        </Pressable>

        <Text className="ml-4 text-xl font-bold text-gray-900">
          Select Location
        </Text>
      </View>

      {/* MAP */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={location}
          title="Your Location"
          description={address}
        />
      </MapView>

      {/* BOTTOM LOCATION CARD */}
      <View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-5"
        style={{ elevation: 15 }}
      >
        <View className="flex-row items-center">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-pink-100">
            <Ionicons name="location" size={25} color="#ec4899" />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-sm text-gray-500">Selected Location</Text>

            <Text
              className="mt-1 text-base font-bold text-gray-900"
              numberOfLines={2}
            >
              {address}
            </Text>
          </View>
        </View>

        {/* USE CURRENT LOCATION */}
        <Pressable
          onPress={getCurrentLocation}
          className="mt-4 flex-row items-center justify-center rounded-xl border border-gray-200 py-3"
        >
          <Ionicons name="locate" size={20} color="#ec4899" />

          <Text className="ml-2 font-semibold text-pink-500">
            Use Current Location
          </Text>
        </Pressable>

        {/* CONFIRM */}
        <Pressable
          onPress={handleSelectLocation}
          className="mt-3 items-center rounded-xl bg-pink-500 py-4"
        >
          <Text className="text-lg font-bold text-white">Confirm Location</Text>
        </Pressable>
      </View>
    </View>
  );
}
