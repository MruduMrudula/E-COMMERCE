
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSignIn } from "@clerk/expo/legacy";
import { useAuth, useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";

import { useToast } from "../Contexts/ToastContext";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const inputColors = ["#c0609b", "#c0609b"];

export default function Login() {
  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const { setActive } = useClerk();
  const router = useRouter();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    if (!isLoaded) {
      showToast("Please wait, authentication is loading", "error");
      return;
    }

    if (isSignedIn) {
      router.replace("/(tabs)/home");
      return;
    }

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)/home");
        return;
      }

      showToast(`Login is not complete: ${result.status}`, "error");
    } catch (error) {
      const message =
        error?.errors?.[0]?.message || error?.message || "Login failed";

      showToast(message, "error");
    }
  };

  return (
    <View className="flex-1 bg-[#eef1f5]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          <LinearGradient
            colors={["#b8579a", "#9b4aa3", "#8b44a6"]}
            style={{
              height: 280,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 30,
              borderBottomLeftRadius: 60,
              borderBottomRightRadius: 60,
            }}
          >
            <Image
              source={require("../assets/image.png")}
              resizeMode="contain"
              style={{ width: 200, height: 200 }}
            />
          </LinearGradient>

          <View
            className="mt-10 mx-[24px] rounded-[24px] bg-white px-[20px] pb-[24px] pt-[30px]"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 14,
              elevation: 8,
            }}
          >
            <Text className="mb-[30px] text-center text-[30px] font-semibold tracking-[2px] text-black">
              SIGN IN
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <LinearGradient
                  colors={inputColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 30,
                    paddingHorizontal: 20,
                    marginBottom: 14,
                  }}
                >
                  <Ionicons name="person-outline" size={22} color="#fff" />
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#f3d9e8"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    style={{
                      flex: 1,
                      color: "#fff",
                      fontSize: 16,
                      paddingVertical: 16,
                      marginLeft: 16,
                    }}
                  />
                </LinearGradient>
              )}
            />

            {errors.email && (
              <Text className="mb-[10px] text-red-500">
                {errors.email.message}
              </Text>
            )}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <LinearGradient
                  colors={inputColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 30,
                    paddingHorizontal: 20,
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={22} color="#fff" />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#f3d9e8"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    style={{
                      flex: 1,
                      color: "#fff",
                      fontSize: 16,
                      paddingVertical: 16,
                      marginLeft: 16,
                    }}
                  />
                </LinearGradient>
              )}
            />

            {errors.password && (
              <Text className="mb-[10px] text-red-500">
                {errors.password.message}
              </Text>
            )}

            <Pressable onPress={() => router.push("/forgot")}>
              <Text className="mb-[20px] mr-[6px] text-right text-[13px] text-gray-600">
                Forgot Password?
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit(handleLogin)}
              className="mb-[16px] self-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <LinearGradient
                colors={["#9b3f98", "#d0649c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 25,
                  paddingVertical: 12,
                  paddingHorizontal: 36,
                  alignItems: "center",
                }}
              >
                <Text className="text-[16px] font-semibold text-white">
                  LOGIN
                </Text>
              </LinearGradient>
            </Pressable>

            <View className="flex-row items-center justify-center">
              <Text className="text-[14px] text-gray-600">
                Don&apos;t have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/signUp")}>
                <Text className="text-[16px] font-semibold text-[#a23f99]">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>

          <Text className="my-[24px] px-[20px] text-center text-[12px] text-gray-500">
            By using this app you agree to the{" "}
            <Text className="font-semibold text-black">Terms</Text> &{" "}
            <Text className="font-semibold text-black">Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}









// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   ImageBackground,
//   ScrollView,
//   Platform,
//   KeyboardAvoidingView,
// } from "react-native";
// import { useWindowDimensions } from "react-native";
// import { useSignIn } from "@clerk/expo/legacy";
// import { useAuth,useClerk } from "@clerk/expo";
// import { useRouter } from "expo-router";

// import { useToast } from "../Contexts/ToastContext";

// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// // ZOD VALIDATION SCHEMA

// const loginSchema = z.object({
//   email: z
//     .string()
//     .trim()
//     .min(1, "Email is required")
//     .email("Please enter a valid email"),

//   password: z.string().min(1, "Password is required"),
// });

// export default function Login() {
//   // CLERK
//   const { signIn, isLoaded } = useSignIn();

//   const { isSignedIn, userId } = useAuth();
// const { setActive } = useClerk();
//   const router = useRouter();

//   const { showToast } = useToast();
//   const { width, height } = useWindowDimensions();
//   // REACT HOOK FORM

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),

//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   // LOGIN FUNCTION

//   const handleLogin = async (data) => {
//     console.log("LOGIN BUTTON PRESSED");

//     // Clerk loading check
//     if (!isLoaded) {
//       console.log("CLERK IS NOT LOADED");

//       showToast("Please wait, authentication is loading", "error");

//       return;
//     }

//     console.log("CLERK IS LOADED");

//     console.log("SIGNED IN:", isSignedIn);

//     console.log("USER ID:", userId);

//     // Already signed in
//     if (isSignedIn) {
//       console.log("USER ALREADY SIGNED IN");

//       router.replace("/(tabs)/home");

//       return;
//     }

//     try {
//       console.log("STARTING CLERK LOGIN...");

//       console.log("EMAIL:", data.email);

//       // CLERK LOGIN

//       const result = await signIn.create({
//         identifier: data.email,
//         password: data.password,
//       });

//       console.log("CLERK RESULT:", result);

//       console.log("LOGIN STATUS:", result.status);

//       // LOGIN SUCCESS

//       if (result.status === "complete") {
//         console.log("LOGIN SUCCESSFUL");
//  await setActive({ session: result.createdSessionId });
//         router.replace("/(tabs)/home");

//         return;
//       }

//       // LOGIN NOT COMPLETE

//       console.log("LOGIN NOT COMPLETE:", result.status);

//       showToast(`Login is not complete: ${result.status}`, "error");
//     } catch (error) {
//       console.log("CLERK LOGIN ERROR:", error);

//       // Clerk error message
//       const message =
//         error?.errors?.[0]?.message || error?.message || "Login failed";

//       showToast(message, "error");
//     }
//   };

//   // UI

//   return (
//     <View className="flex-1 bg-white dark:bg-[#292929]">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1 }}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//           automaticallyAdjustKeyboardInsets={true}
//         >
//           <ImageBackground
//             source={require("../assets/Cart.png")}
//             resizeMode="cover"
//             style={{
//               width: width,
//               height: height * 0.36,
//               marginTop: 40,
//             }}
//           />

//           <View className="-mt-[30px] flex-1 rounded-t-[30px] bg-white px-[20px] pb-[30px] pt-[25px] dark:bg-[#292929]">
//             {/* LOGIN TITLE */}

//             <Text className="mb-[20px] text-[28px] font-bold text-black dark:text-white">
//               Login
//             </Text>

//             {/* EMAIL */}

//             <Controller
//               control={control}
//               name="email"
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <TextInput
//                   placeholder="Email"
//                   placeholderTextColor="#999"
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   keyboardType="email-address"
//                   className="mb-[14px] rounded-[25px] border border-gray-200 bg-white px-[18px] py-[12px] text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
//                 />
//               )}
//             />

//             {/* EMAIL ERROR */}

//             {errors.email && (
//               <Text className="mb-[10px] text-red-500">
//                 {errors.email.message}
//               </Text>
//             )}

//             {/* PASSWORD */}

//             <Controller
//               control={control}
//               name="password"
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <TextInput
//                   placeholder="Password"
//                   placeholderTextColor="#999"
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   secureTextEntry
//                   className="mb-[10px] rounded-[25px] border border-gray-200 bg-white px-[18px] py-[12px] text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
//                 />
//               )}
//             />

//             {/* PASSWORD ERROR */}

//             {errors.password && (
//               <Text className="mb-[10px] text-red-500">
//                 {errors.password.message}
//               </Text>
//             )}

//             {/* FORGOT PASSWORD */}

//             <Pressable onPress={() => router.push("/forgot")}>
//               <Text className="mb-[20px] text-right text-[13px] font-semibold text-black dark:text-white">
//                 Forgot Password?
//               </Text>
//             </Pressable>

//             {/* LOGIN BUTTON */}

//             <Pressable
//               onPress={handleSubmit(handleLogin)}
//               className="mb-[12px] items-center rounded-[25px] bg-[#0f8a73] py-[14px]"
//             >
//               <Text className="text-[16px] font-bold text-white">Login</Text>
//             </Pressable>

//             {/* SIGN UP */}

//             <Pressable
//               onPress={() => router.push("/signUp")}
//               className="items-center rounded-[25px] bg-[#ecece6] py-[14px]"
//             >
//               <Text className="text-[16px] font-semibold text-black">
//                 Sign up
//               </Text>
//             </Pressable>

//             <Text className="mt-[18px] text-center text-[12px] text-gray-500 dark:text-gray-400">
//               By using this app you agree to the{" "}
//               <Text className="font-semibold text-black dark:text-white">
//                 Terms
//               </Text>{" "}
//               &{" "}
//               <Text className="font-semibold text-black dark:text-white">
//                 Privacy Policy
//               </Text>
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }