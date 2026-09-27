import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useUser, useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
export default function Profile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">User not found</Text>
      </View>
    );
  }

  const email = user.primaryEmailAddress?.emailAddress;

  const isEmailVerified =
    user.primaryEmailAddress?.verification?.status === "verified";

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Unable to logout");
    }
  };

  return (
    // <View className="flex-1 bg-gray-100 px-5 pt-12">
      <LinearGradient
        colors={["#FDF0F3", "#FFFBFC"]}
        style={{
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 5,
        }}
      >
        {/* Header */}
        <Text className="mb-8 text-3xl font-bold text-gray-900">
          My Profile
        </Text>

        {/* Profile Card */}
        <View className="items-center rounded-3xl bg-white p-6">
          {/* Profile Image */}
          <Image
            source={{ uri: user.imageUrl }}
            className="mb-4 h-28 w-28 rounded-full"
          />

          {/* Name */}
          <Text className="text-2xl font-bold text-gray-900">
            {user.firstName || "User"} {user.lastName || ""}
          </Text>

          {/* Email */}
          <Text className="mt-2 text-base text-gray-500">{email}</Text>

          {/* Verification Status */}
          <View
            className={`mt-4 rounded-full px-4 py-2 ${
              isEmailVerified ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <Text
              className={`font-semibold ${
                isEmailVerified ? "text-green-700" : "text-red-700"
              }`}
            >
              {isEmailVerified ? "Email Verified" : "Email Not Verified"}
            </Text>
          </View>
        </View>

        {/* User Information */}
        <View className="mt-6 rounded-3xl bg-white p-5">
          <Text className="mb-4 text-xl font-bold text-gray-900">
            User Information
          </Text>

          {/* First Name */}
          <View className="mb-4">
            <Text className="text-sm text-gray-500">First Name</Text>

            <Text className="mt-1 text-base font-semibold text-gray-900">
              {user.firstName || "Not provided"}
            </Text>
          </View>

          {/* Last Name */}
          <View className="mb-4">
            <Text className="text-sm text-gray-500">Last Name</Text>

            <Text className="mt-1 text-base font-semibold text-gray-900">
              {user.lastName || "Not provided"}
            </Text>
          </View>

          {/* Email */}
          <View>
            <Text className="text-sm text-gray-500">Email</Text>

            <Text className="mt-1 text-base font-semibold text-gray-900">
              {email}
            </Text>
          </View>
        </View>

        {/* Edit Profile */}
        <TouchableOpacity
          onPress={() => router.push("/edit-profile")}
          className="mt-6 items-center rounded-2xl bg-pink-500 py-4"
        >
          <Text className="text-lg font-bold text-white">Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-4 items-center rounded-2xl border border-red-500 bg-white py-4"
        >
          <Text className="text-lg font-bold text-red-500">Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    // </View>
  );
}
