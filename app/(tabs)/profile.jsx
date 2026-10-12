
import React from "react";
import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useUser, useClerk } from "@clerk/expo";

const MenuGroup = ({ items, isDark }) => (
  <View className="mx-5 rounded-2xl bg-white px-4 dark:bg-[#202223]">
    {items.map((item, index) => (
      <View key={item.title}>
        <Pressable
          onPress={() => router.push(item.route)}
          className="flex-row items-center py-2.5 mb-1 mt-1"
        >
          <View
            style={{ backgroundColor: isDark ? item.darkBg : item.lightBg }}
            className="h-9 w-9 items-center mb-2 mt-2 justify-center rounded-xl"
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={isDark ? item.dark : item.light}
            />
          </View>

          <Text className="flex-1 ml-3 text-[15px] font-bold text-gray-900 dark:text-white">
            {item.title}
          </Text>

          <Ionicons
            name="arrow-forward-outline"
            size={16}
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
        </Pressable>

        {index !== items.length - 1 && (
          <View className="h-[1px] bg-gray-100 dark:bg-gray-700" />
        )}
      </View>
    ))}
  </View>
);
export default function Profile() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { signOut } = useClerk();
  const isDark = colorScheme === "dark";

  const { user } = useUser();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("Logout error:", error);
      console.log("PROFILE CLERK:", {
        // authLoaded,
        // isSignedIn,
        // userId,
        // userLoaded,
        clerkUserId: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
      });
    }
  };

  const menuItems = [
    {
      title: "Edit profile",
      icon: "person-circle-outline",
      route: "/edit-profile",
      light: "#7c3aed",
      dark: "#a78bfa",
      lightBg: "#ede9fe",
      darkBg: "rgba(167,139,250,0.18)",
    },
    {
      title: "Wishlist",
      icon: "heart-outline",
      route: "/wishlistScreen",
      light: "#e11d48",
      dark: "#fb7185",
      lightBg: "#ffe4e6",
      darkBg: "rgba(251,113,133,0.18)",
    },
    {
      title: "Orders",
      icon: "bag-outline",
      route: "/orders",
      light: "#d97706",
      dark: "#fbbf24",
      lightBg: "#fef3c7",
      darkBg: "rgba(251,191,36,0.18)",
    },
    {
      title: "Location",
      icon: "location-outline",
      route: "/location",
      light: "#059669",
      dark: "#34d399",
      lightBg: "#d1fae5",
      darkBg: "rgba(52,211,153,0.18)",
    },
    {
      title: "Contact us",
      icon: "headset-outline",
      route: "/contactModal",
      light: "#0284c7",
      dark: "#38bdf8",
      lightBg: "#e0f2fe",
      darkBg: "rgba(56,189,248,0.18)",
    },
  ];
  const accountItems = menuItems.slice(0, 4);
  const supportItems = menuItems.slice(4);

  const iconColor = isDark ? "#ffffff" : "#111827";


  const themeOptions = [
    { key: "light", label: "☀️ Light" },
    { key: "system", label: "📱 System" },
    { key: "dark", label: "🌙 Dark" },
  ];

  return (
    <View className="flex-1 bg-[#f7f7f7] dark:bg-[#151718]">
      {/* HEADER */}
      <View className="flex-row items-center  px-5 pb-3 pt-12 dark:bg-[#151718]">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-[#303234]"
        >
          <Ionicons name="chevron-back" size={22} color={iconColor} />
        </Pressable>

        <Text className="flex-1 text-center text-[29px] font-extrabold text-gray-900 dark:text-white">
          Profile
        </Text>

        <View className="h-10 w-10" />
      </View>

      <View className="flex-1">
        {/* PROFILE CARD */}
        <View className="mx-5 mt-2 flex-row items-center  bg-white/100 rounded-2xl  p-5 dark:bg-[#202223]">
          <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-[#303234]">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-full h-full"
              />
            ) : (
              <Ionicons name="person" size={26} color="#ec4899" />
            )}
          </View>

          <View className="ml-4 flex-1">
            <Text
              numberOfLines={1}
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {user?.fullName || "Your Name"}
            </Text>
            <Text
              numberOfLines={1}
              className="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
            >
              {user?.primaryEmailAddress?.emailAddress || "your@email.com"}
            </Text>
          </View>
        </View>

        {/* ACCOUNT */}
        <Text className="mx-5 mb-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
          Account
        </Text>
        <MenuGroup items={accountItems} isDark={isDark} />

        {/* PREFERENCES */}
        <Text className="mx-5 mb-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
          Preferences
        </Text>
        <View className="mx-5 rounded-2xl bg-white/100 px-4 dark:bg-[#202223]">
          <View className="flex-row items-center py-2.5">
            <View
              style={{
                backgroundColor: isDark ? "rgba(244,114,182,0.18)" : "#fce7f3",
              }}
              className="h-9 w-9 items-center justify-center rounded-xl"
            >
              <Ionicons
                name="contrast-outline"
                size={20}
                color={isDark ? "#111" : "white"}
              />
            </View>
            <Text className="flex-1 ml-3 text-[15px] font-bold text-gray-900 dark:text-white">
              Theme
            </Text>
            <Text className="text-sm capitalize text-gray-500 dark:text-gray-400">
              {colorScheme}
            </Text>
          </View>

          <View className="h-[1px] bg-gray-100 dark:bg-gray-700" />

          <View className="flex-row py-3">
            {themeOptions.map((option, index) => (
              <Pressable
                key={option.key}
                onPress={() => setColorScheme(option.key)}
                className={`flex-1 items-center rounded-lg py-2.5 ${
                  index !== themeOptions.length - 1 ? "mr-2" : ""
                } ${
                  colorScheme === option.key
                    ? "bg-gray-900 dark:bg-white"
                    : "bg-gray-100 dark:bg-[#303234]"
                }`}
              >
                <Text
                  className={`text-xs ${
                    colorScheme === option.key
                      ? "text-white dark:text-black"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* SUPPORT */}
        <Text className="mx-5 mb-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
          Support
        </Text>
        <MenuGroup items={supportItems} isDark={isDark} />
        {/* LOGOUT */}
        <View className="mb-2 mt-5 px-5 pb-6">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="items-center rounded-full bg-pink-500 py-3 dark:bg-pink-600"
          >
            <Text className="text-[18px] font-semibold text-white">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}



// first code
// import React from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   Image,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useColorScheme } from "nativewind";
// import { useUser, useClerk } from "@clerk/expo";

// export default function Profile() {
//   const { colorScheme, setColorScheme } = useColorScheme();
//   const { signOut } = useClerk();
//   const isDark = colorScheme === "dark";

//   const { user } = useUser();

//   const handleLogout = async () => {
//     try {
//       await signOut();
//     } catch (error) {
//       console.log("Logout error:", error);
//       console.log("PROFILE CLERK:", {
//         authLoaded,
//         isSignedIn,
//         userId,
//         userLoaded,
//         clerkUserId: user?.id,
//         firstName: user?.firstName,
//         lastName: user?.lastName,
//       });
//     }
//   };
//   // const handleLogout = async () => {
//   //   try {
//   //     await signOut();
//   //   } catch (error) {
//   //     console.log("Logout error:", error);
//   //   }
//   // };
//     const menuItems = [
//       {
//         title: "Edit profile",
//         icon: "person-outline",
//         route: "/edit-profile",
//       },
//       {
//         title: "Wishlist",
//         icon: "heart-outline",
//         route: "/wishlistScreen",
//       },
//       {
//         title: "Orders",
//         icon: "bag-outline",
//         route: "/orders",
//       },
//       {
//         title: "Location",
//         icon: "location-outline",
//         route: "/location",
//       },
//       {
//         title: "Contact us",
//         icon: "headset-outline",
//         route: "/contactModal",
//       },
//     ];

//   return (
//     <View className="flex-1 bg-white dark:bg-[#151718]">
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 30 }}
//       >
//         {/* TOP SECTION */}
//         <View className="px-5 pt-12">
//           {/* Back */}
//           <View className="flex-row items-center justify-between">
//             <Pressable
//               onPress={() => router.back()}
//               className="h-11 w-11 items-center justify-center rounded-full bg-gray-100 dark:bg-[#303234]"
//             >
//               <Ionicons
//                 name="chevron-back"
//                 size={22}
//                 color={isDark ? "white" : "#222"}
//               />
//             </Pressable>
//           </View>

//           {/* PROFILE IMAGE */}
//           <View className="items-center mt-7">
//             <View className="w-36 h-36 rounded-full bg-gray-100 items-center justify-center overflow-hidden dark:bg-[#303234]">
//               {user?.imageUrl ? (
//                 <Image
//                   source={{ uri: user.imageUrl }}
//                   className="w-full h-full"
//                 />
//               ) : (
//                 <Ionicons name="person" size={65} color="#ec4899" />
//               )}
//             </View>

//             {/* USER LABEL */}
//             <View className="bg-pink-500 px-3 py-1 rounded-md mt-[-5px]">
//               <Text className="text-white text-xs font-bold">USER</Text>
//             </View>

//             {/* NAME */}
//             <Text className="text-xl font-bold text-gray-900 dark:text-white mt-3">
//               {user?.fullName || "Your Name"}
//             </Text>

//             {/* EMAIL */}
//             <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               {user?.primaryEmailAddress?.emailAddress || "your@email.com"}
//             </Text>
//           </View>

//           {/* logout */}
//           <TouchableOpacity
//             onPress={handleLogout}
//             activeOpacity={0.8}
//             className="mt-6 items-center rounded-full bg-pink-500 py-[16px] dark:bg-pink-600"
//           >
//             <Text className="text-[20px] font-semibold text-white">Logout</Text>
//           </TouchableOpacity>
//         </View>

//         {/* MENU CARD */}
//         <View className="mx-5 mt-8 rounded-[20px] border border-gray-200 bg-[#fdfcfb] px-5 py-2 dark:border-gray-700 dark:bg-[#202223]">
//           {/* PROFILE OPTIONS */}
//           {menuItems.map((item, index) => (
//             <View key={item.title}>
//               <Pressable
//                 onPress={() => router.push(item.route)}
//                 className="flex-row items-center py-4"
//               >
//                 {/* ICON */}
//                 <Ionicons
//                   name={item.icon}
//                   size={24}
//                   color={isDark ? "pink" : "pink"}
//                 />

//                 {/* TITLE */}
//                 <Text className="  flex-1 ml-4 text-[17px] text-gray-900 dark:text-white">
//                   {item.title}
//                 </Text>

//                 {/* ARROW */}
//                 <Ionicons
//                   name="chevron-forward"
//                   size={20}
//                   color={isDark ? "#aaa" : "#555"}
//                 />
//               </Pressable>

//               {/* DIVIDER */}
//               {index !== menuItems.length - 1 && (
//                 <View className="h-[1px] bg-gray-200 dark:bg-gray-700" />
//               )}
//             </View>
//           ))}
//         </View>

//         {/* THEME */}
//         <View className="items-center py-10">
//           {/* Theme title */}
//           <Text className="text-[15px] font-medium text-gray-800 dark:text-white">
//             Theme
//           </Text>

//           {/* Theme options */}
//           <View className="flex-row mt-3">
//             {/* Light */}
//             <Pressable
//               onPress={() => setColorScheme("light")}
//               className={`px-4 py-3 rounded-lg mr-2 ${
//                 colorScheme === "light"
//                   ? "bg-indigo-100"
//                   : "bg-gray-100 dark:bg-[#303234]"
//               }`}
//             >
//               <Text className="text-xs text-gray-800 dark:text-white">
//                 ☀️ Light
//               </Text>
//             </Pressable>

//             {/* System */}
//             <Pressable
//               onPress={() => setColorScheme("system")}
//               className={`px-4 py-3 rounded-lg mr-2 ${
//                 colorScheme === "system"
//                   ? "bg-indigo-100"
//                   : "bg-gray-100 dark:bg-[#303234]"
//               }`}
//             >
//               <Text className="text-xs text-gray-800 dark:text-white">
//                 📱 System
//               </Text>
//             </Pressable>

//             {/* Dark */}
//             <Pressable
//               onPress={() => setColorScheme("dark")}
//               className={`px-4 py-3 rounded-lg ${
//                 colorScheme === "dark"
//                   ? "bg-indigo-100"
//                   : "bg-gray-100 dark:bg-[#303234]"
//               }`}
//             >
//               <Text className="text-xs text-gray-800 dark:text-white">
//                 🌙 Dark
//               </Text>
//             </Pressable>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }