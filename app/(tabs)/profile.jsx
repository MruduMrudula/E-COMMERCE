
import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useUser, useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useToast } from "../../Contexts/ToastContext";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { signOut, isSignedIn } = useAuth();
 const { showToast } = useToast();
  // LOADING
  

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-700">Loading profile...</Text>
      </View>
    );
  }

  
  // NOT SIGNED IN
  

  if (!isSignedIn) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5">
        <Text className="mb-4 text-lg text-gray-700">Please login first</Text>

        <TouchableOpacity
          onPress={() => router.replace("/login")}
          className="rounded-xl bg-blue-500 px-8 py-4"
        >
          <Text className="font-bold text-white">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  // USER STILL NOT AVAILABLE
  

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-700">Loading user...</Text>
      </View>
    );
  }

  
  // USER DAta

  const email = user.primaryEmailAddress?.emailAddress || "No email";

  const isEmailVerified =
    user.primaryEmailAddress?.verification?.status === "verified";

  const firstName = user.firstName || "User";
  const lastName = user.lastName || "";

  
  // LOGOUT


  const handleLogout = async () => {
    try {
      await signOut();

      router.replace("/login");
    } catch (error) {
      console.log("Logout error:", error);

      showToast( "Unable to logout", "Error");
    }
  };


  // SCREEN
  

  return (
    <LinearGradient
      colors={["#292929", "#4A4A4A"]}
      style={{
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
      }}
    >
      {/* HEADER */}

      <Text className="mb-8 mt-12 text-3xl font-bold text-white">
        My Profile
      </Text>

      {/* PROFILE CARD */}

      <View className="items-center rounded-3xl bg-white p-6">
        {/* PROFILE IMAGE */}

        <Image
          source={
            user.imageUrl
              ? { uri: user.imageUrl }
              : require("../../assets/caller.png")
          }
          className="mb-4 h-28 w-28 rounded-full"
        />

        {/* NAME */}

        <Text className="text-2xl font-bold text-gray-900">
          {firstName} {lastName}
        </Text>

        {/* EMAIL */}

        <Text className="mt-2 text-base text-gray-500">{email}</Text>

        {/* VERIFICATION */}

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

      {/* USER INFORMATION */}

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="mb-4 text-xl font-bold text-gray-900">
          User Information
        </Text>

        {/* FIRST NAME */}

        <View className="mb-4">
          <Text className="text-sm text-gray-500">First Name</Text>

          <Text className="mt-1 text-base font-semibold text-gray-900">
            {user.firstName || "Not provided"}
          </Text>
        </View>

        {/* LAST NAME */}

        <View className="mb-4">
          <Text className="text-sm text-gray-500">Last Name</Text>

          <Text className="mt-1 text-base font-semibold text-gray-900">
            {user.lastName || "Not provided"}
          </Text>
        </View>

        {/* EMAIL */}

        <View>
          <Text className="text-sm text-gray-500">Email</Text>

          <Text className="mt-1 text-base font-semibold text-gray-900">
            {email}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/orders")}
        className="mt-6 items-center rounded-2xl bg-pink-500 py-4"
      >
        <Text className="text-lg font-bold text-white">Orders</Text>
      </TouchableOpacity>

      {/* EDIT PROFILE */}

      <TouchableOpacity
        onPress={() => router.push("/edit-profile")}
        className="mt-6 items-center rounded-2xl bg-pink-500 py-4"
      >
        <Text className="text-lg font-bold text-white">Edit Profile</Text>
      </TouchableOpacity>

      {/* LOGOUT */}

      <TouchableOpacity
        onPress={handleLogout}
        className="mt-4 items-center rounded-2xl border border-red-500 bg-white py-4"
      >
        <Text className="text-lg font-bold text-red-500">Logout</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
