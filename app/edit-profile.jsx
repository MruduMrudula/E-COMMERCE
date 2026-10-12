// import React, { useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Image,
// } from "react-native";

// import { useAuth, useUser } from "@clerk/expo";import { Feather } from "@expo/vector-icons";
// import { useColorScheme } from "nativewind";
// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { router } from "expo-router";

// const profileSchema = z.object({
//   firstName: z
//     .string()
//     .min(2, "First name must be at least 2 characters")
//     .max(30, "First name is too long"),

//   lastName: z
//     .string()
//     .min(2, "Last name must be at least 2 characters")
//     .max(30, "Last name is too long"),

//   phoneNumber: z
//     .string()
//     .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
// });

// export default function EditProfile() {
//   const { isLoaded: authLoaded, isSignedIn, userId } = useAuth();
//     const { user, isLoaded: userLoaded } = useUser();

//   const { colorScheme } = useColorScheme();
//   const isDark = colorScheme === "dark";

//   console.log("EDIT PROFILE:", {
//     authLoaded,
//     isSignedIn,
//     userId,
//     userLoaded,
//     clerkUserId: user?.id,
//     firstName: user?.firstName,
//     lastName: user?.lastName,
//   });
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       phoneNumber: "",
//     },
//   });

//   useEffect(() => {
//     if (!userLoaded && !user) {
//       reset({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         phoneNumber: user.primaryPhoneNumber?.phoneNumber
//           ? user.primaryPhoneNumber.phoneNumber.replace("+91", "")
//           : "",
//       });
//     }
//   }, [userLoaded, user, reset]);

//   const onSubmit = async (data) => {
//     try {
//       if (!user) {
//         console.log("Clerk user is not available");
//         return;
//       }

//       await user.update({
//         firstName: data.firstName,
//         lastName: data.lastName,
//       });

//       console.log("Profile updated successfully");

//       router.back();
//     } catch (error) {
//       console.log("Profile update error:", error);
//     }
//   };

//   if (!authLoaded || !userLoaded) {
//     return (
//       <View className="flex-1 items-center justify-center bg-[#FDF0F3] dark:bg-[#151718]">
//         <Text className="text-lg text-gray-700 dark:text-gray-200">
//           Loading profile...
//         </Text>
//       </View>
//     );
//     if (!isSignedIn || !userId || !user) {
//       return (
//         <View className="flex-1 items-center justify-center bg-white dark:bg-[#151718]">
//           <Text className="text-lg text-gray-700 dark:text-gray-200">
//             User not found
//           </Text>
//         </View>
//       );
//     }
//   }

//   return (
//     <KeyboardAvoidingView
//       className="flex-1 bg-white dark:bg-[#151718]"
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 40 }}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="px-5 pt-14 pb-8">
//           <View className="flex-row items-center justify-between">
//             <TouchableOpacity
//               onPress={() => router.back()}
//               className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#303234] items-center justify-center"
//             >
//               <Feather
//                 name="chevron-left"
//                 size={22}
//                 color={isDark ? "white" : "#111827"}
//               />
//             </TouchableOpacity>

//             <Text className="text-xl font-bold text-gray-900 dark:text-white">
//               Edit Profile
//             </Text>

//             <View className="w-11" />
//           </View>

//           <View className="items-center mt-7">
//             <View className="relative">
//               {user?.imageUrl ? (
//                 <Image
//                   source={{ uri: user.imageUrl }}
//                   className="w-28 h-28 rounded-full"
//                 />
//               ) : (
//                 <View className="w-28 h-28 rounded-full bg-gray-100 dark:bg-[#303234] items-center justify-center">
//                   <Feather
//                     name="user"
//                     size={50}
//                     color={isDark ? "white" : "#111827"}
//                   />
//                 </View>
//               )}
//             </View>

//             <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
//               {user.firstName || "User"} {user.lastName || ""}
//             </Text>

//             <Text className="text-gray-500 dark:text-gray-400 mt-1">
//               {user.primaryEmailAddress?.emailAddress || ""}
//             </Text>
//           </View>
//         </View>

//         <View className="bg-white dark:bg-[#1C1C1E] rounded-t-[32px] px-5 pt-7 pb-8 min-h-[500px]">
//           <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6">
//             Personal Information
//           </Text>
//           <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//             First Name
//           </Text>
//           <View
//             className={`h-[54px] flex-row items-center rounded-2xl px-4 bg-gray-50 dark:bg-[#292929] border ${
//               errors.firstName
//                 ? "border-red-500"
//                 : "border-gray-100 dark:border-gray-700"
//             }`}
//           >
//             <Feather
//               name="user"
//               size={21}
//               color={isDark ? "white" : "#111827"}
//             />

//             <Controller
//               control={control}
//               name="firstName"
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <TextInput
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   placeholder="Enter first name"
//                   placeholderTextColor="#9CA3AF"
//                   autoCapitalize="words"
//                   className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
//                 />
//               )}
//             />
//           </View>
//           {errors.firstName && (
//             <Text className="text-red-500 text-xs mt-1.5">
//               {errors.firstName.message}
//             </Text>
//           )}
//           <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-2">
//             Last Name
//           </Text>
//           <View
//             className={`h-[54px] flex-row items-center rounded-2xl px-4 bg-gray-50 dark:bg-[#292929] border ${
//               errors.lastName
//                 ? "border-red-500"
//                 : "border-gray-100 dark:border-gray-700"
//             }`}
//           >
//             <Feather
//               name="user"
//               size={21}
//               color={isDark ? "white" : "#111827"}
//             />

//             <Controller
//               control={control}
//               name="lastName"
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <TextInput
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   placeholder="Enter last name"
//                   placeholderTextColor="#9CA3AF"
//                   autoCapitalize="words"
//                   className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
//                 />
//               )}
//             />
//           </View>
//           {errors.lastName && (
//             <Text className="text-red-500 text-xs mt-1.5">
//               {errors.lastName.message}
//             </Text>
//           )}
//           <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-2">
//             Phone Number
//           </Text>
//           <View
//             className={`h-[54px] flex-row items-center rounded-2xl px-4 bg-gray-50 dark:bg-[#292929] border ${
//               errors.phoneNumber
//                 ? "border-red-500"
//                 : "border-gray-100 dark:border-gray-700"
//             }`}
//           >
//             <Feather
//               name="phone"
//               size={21}
//               color={isDark ? "white" : "#111827"}
//             />

//             <Controller
//               control={control}
//               name="phoneNumber"
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <TextInput
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   placeholder="Enter phone number"
//                   placeholderTextColor="#9CA3AF"
//                   keyboardType="phone-pad"
//                   maxLength={10}
//                   className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
//                 />
//               )}
//             />
//           </View>
//           {errors.phoneNumber && (
//             <Text className="text-red-500 text-xs mt-1.5">
//               {errors.phoneNumber.message}
//             </Text>
//           )}
//           <TouchableOpacity
//             onPress={handleSubmit(onSubmit)}
//             activeOpacity={0.8}
//             disabled={isSubmitting}
//             className={`h-[55px] rounded-full items-center justify-center mt-8 ${
//               isSubmitting
//                 ? "bg-pink-300 dark:bg-pink-400"
//                 : "bg-pink-500 dark:bg-pink-600"
//             }`}
//           >
//             <Text className="text-white text-base font-bold">
//               {isSubmitting ? "Saving..." : "Save Changes"}
//             </Text>
//           </TouchableOpacity>

//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";

import { useAuth, useUser } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";

const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name is too long"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name is too long"),

  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
});

export default function EditProfile() {
  const { isLoaded: authLoaded, isSignedIn, userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  console.log("EDIT PROFILE:", {
    authLoaded,
    isSignedIn,
    userId,
    userLoaded,
    clerkUserId: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (userLoaded && user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.primaryPhoneNumber?.phoneNumber
          ? user.primaryPhoneNumber.phoneNumber.replace("+91", "")
          : "",
      });
    }
  }, [userLoaded, user, reset]);

  const onSubmit = async (data) => {
    try {
      if (!user) {
        console.log("Clerk user is not available");
        return;
      }

      await user.update({
        firstName: data.firstName,
        lastName: data.lastName,
      });

      await user.reload();

      console.log("PROFILE AFTER UPDATE:", {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.primaryEmailAddress?.emailAddress,
      });


      router.back();
    } catch (error) {
      console.log("Profile update error:", error);
    }
  };

  if (!authLoaded || !userLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FDF0F3] dark:bg-[#151718]">
        <Text className="text-lg text-gray-700 dark:text-gray-200">
          Loading profile...
        </Text>
      </View>
    );
  }

  if (!isSignedIn || !userId || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#151718]">
        <Text className="text-lg text-gray-700 dark:text-gray-200">
          User not found
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-[#151718]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-14 pb-8">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#303234] items-center justify-center"
            >
              <Feather
                name="chevron-left"
                size={22}
                color={isDark ? "white" : "#111827"}
              />
            </TouchableOpacity>

            <Text className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Edit Profile
            </Text>

            <View className="w-11" />
          </View>

          <View className="items-center mt-7">
            <View className="relative">
              {user.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-28 h-28 rounded-full"
                />
              ) : (
                <View className="w-28 h-28 rounded-full bg-gray-100 dark:bg-[#303234] items-center justify-center">
                  <Feather
                    name="user"
                    size={50}
                    color={isDark ? "white" : "#111827"}
                  />
                </View>
              )}
            </View>

            <Text className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
              {user.firstName || "User"} {user.lastName || ""}
            </Text>

            <Text className="text-gray-500 font-bold dark:text-gray-400 mt-1">
              {user.primaryEmailAddress?.emailAddress || ""}
            </Text>
          </View>
        </View>

        <View className="bg-white dark:bg-[#1C1C1E] rounded-t-[32px] px-5 pt-7 pb-8 min-h-[500px]">
          <Text className="text-2xl font-extrabold text-pink-500 dark:text-white mb-6">
            Personal Information
          </Text>

          <Text className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </Text>

          <View
            className={`h-[54px] flex-row items-center rounded-2xl px-4 bg-gray-50 dark:bg-[#292929] border ${
              errors.firstName
                ? "border-red-500"
                : "border-gray-100 dark:border-gray-700"
            }`}
          >
            <Feather name="user" size={22} color={isDark ? "pink" : "pink"} />

            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter first name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
                />
              )}
            />
          </View>

          {errors.firstName && (
            <Text className="text-red-500 text-xs mt-1.5">
              {errors.firstName.message}
            </Text>
          )}

          <Text className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-2">
            Last Name
          </Text>

          <View
            className={`h-[54px] flex-row items-center rounded-2xl px-4 bg-gray-50 dark:bg-[#292929] border ${
              errors.lastName
                ? "border-red-500"
                : "border-gray-100 dark:border-gray-700"
            }`}
          >
            <Feather name="user" size={22} color={isDark ? "pink" : "pink"} />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter last name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
                />
              )}
            />
          </View>

          {errors.lastName && (
            <Text className="text-red-500 text-xs mt-1.5">
              {errors.lastName.message}
            </Text>
          )}

          <Text className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-2">
            Phone Number
          </Text>

          <View
            className={`h-[54px] flex-row items-center rounded-2xl px-4 bg-gray-50 dark:bg-[#292929] border ${
              errors.phoneNumber
                ? "border-red-500"
                : "border-gray-100 dark:border-gray-700"
            }`}
          >
            <Feather name="phone" size={22} color={isDark ? "pink" : "pink"} />

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  maxLength={10}
                  className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
                />
              )}
            />
          </View>

          {errors.phoneNumber && (
            <Text className="text-red-500 text-xs mt-1.5">
              {errors.phoneNumber.message}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={isSubmitting}
            className={`h-[55px] rounded-full items-center justify-center mt-8 ${
              isSubmitting
                ? "bg-pink-300 dark:bg-pink-400"
                : "bg-pink-500 dark:bg-pink-600"
            }`}
          >
            <Text className="text-white text-xl font-bold">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}