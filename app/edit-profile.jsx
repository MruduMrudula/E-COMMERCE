import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod validation schema
const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),

  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

export default function EditProfile() {
  const { user, isLoaded } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>User not found</Text>
      </View>
    );
  }

  const onSubmit = async (data) => {
    try {
      await user.update({
        firstName: data.firstName,
        lastName: data.lastName,
      });

      Alert.alert("Success", "Profile updated successfully");

      router.back();
    } catch (error) {
      console.log("Profile update error:", error);

      Alert.alert("Error", "Unable to update profile");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {/* Header */}

        <Text className="mb-8 text-3xl font-bold text-gray-900">
          Edit Profile
        </Text>

        {/* First Name */}

        <View className="mb-5">
          <Text className="mb-2 text-base font-semibold text-gray-700">
            First Name
          </Text>

          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-2xl border border-gray-300 bg-white px-4 py-4 text-base"
                placeholder="Enter first name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          {errors.firstName && (
            <Text className="mt-2 text-sm text-red-500">
              {errors.firstName.message}
            </Text>
          )}
        </View>

        {/* Last Name */}

        <View className="mb-5">
          <Text className="mb-2 text-base font-semibold text-gray-700">
            Last Name
          </Text>

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-2xl border border-gray-300 bg-white px-4 py-4 text-base"
                placeholder="Enter last name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          {errors.lastName && (
            <Text className="mt-2 text-sm text-red-500">
              {errors.lastName.message}
            </Text>
          )}
        </View>

        {/* Email */}

        <View className="mb-6">
          <Text className="mb-2 text-base font-semibold text-gray-700">
            Email
          </Text>

          <TextInput
            className="rounded-2xl bg-gray-200 px-4 py-4 text-base text-gray-500"
            value={user.primaryEmailAddress?.emailAddress || ""}
            editable={false}
          />

          <Text className="mt-2 text-sm text-gray-500">
            Email cannot be edited here.
          </Text>
        </View>

        {/* Save Button */}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`items-center rounded-2xl py-4 ${
            isSubmitting ? "bg-gray-400" : "bg-pink-500"
          }`}
        >
          <Text className="text-lg font-bold text-white">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>

        {/* Cancel */}

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 items-center rounded-2xl border border-gray-400 bg-white py-4"
        >
          <Text className="text-lg font-semibold text-gray-700">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
