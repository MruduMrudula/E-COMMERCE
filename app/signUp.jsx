
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { useSignUp } from "@clerk/expo";
import { router } from "expo-router";
import { useToast } from "../Contexts/ToastContext";

// Form handling
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ZOD VALIDATION

const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(15, "Password must be at least 15 characters"),
});

export default function Signup() {
  const { signUp } = useSignUp();

  const { showToast } = useToast();

  useWindowDimensions();

  // REACT HOOK FORM

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  // SIGNUP

  const handleSignup = async (data) => {
    console.log("SIGNUP BUTTON PRESSED");

    try {
      // CLERK SIGNUP

      const { error } = await signUp.password({
        emailAddress: data.email,
        password: data.password,
      });

      if (error) {
        console.log("Signup error:", error);

        showToast(error.message, "error");

        return;
      }

      console.log("Signup successful");

      // SEND EMAIL VERIFICATION

      const { error: verificationError } =
        await signUp.verifications.sendEmailCode();

      if (verificationError) {
        console.log("Verification error:", verificationError);

        showToast(verificationError.message, "error");

        return;
      }

      console.log("Verification code sent");

      // GO TO VERIFY SCREEN

      router.push("/verify");
    } catch (err) {
      console.log("Signup exception:", err);

      showToast("Something went wrong", "error");
    }
  };

  return (
    <View className="flex-1 bg-[#eef1f5] dark:bg-[#151718]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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

          {/* RIGHT SIDE */}

          <View
            className=" mx-[20px] rounded-[25px] bg-white px-[20px] pb-[25px] pt-[30px] dark:bg-[#292929]"
            style={{ elevation: 6 }}
          >
            {/* Sign Up */}

            <Text className="mb-[30px] text-center text-[30px] font-bold tracking-widest text-black dark:text-white">
              SIGN UP
            </Text>

            {/* Email */}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-[14px] flex-row items-center rounded-full bg-[#c0609d] px-[20px]">
                  <Feather name="user" size={20} color="white" />

                  <TextInput
                    placeholder="User name/Email"
                    placeholderTextColor="#f3d9ea"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="ml-[14px] flex-1 py-[16px] text-white"
                  />
                </View>
              )}
            />

            {/* Email Error */}

            {errors.email && (
              <Text className="mb-[10px] text-red-500">
                {errors.email.message}
              </Text>
            )}

            {/* Password */}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-[14px] flex-row items-center rounded-full bg-[#c0609d] px-[20px]">
                  <Feather name="lock" size={20} color="white" />

                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#f3d9ea"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    className="ml-[14px] flex-1 py-[16px] text-white"
                  />
                </View>
              )}
            />

            {/* Password Error */}

            {errors.password && (
              <Text className="mb-[10px] text-red-500">
                {errors.password.message}
              </Text>
            )}

            {/* Create Account */}

            <Pressable
              onPress={handleSubmit(handleSignup)}
              className="mb-[18px] mt-[20px] self-center overflow-hidden rounded-full"
              style={{ elevation: 4 }}
            >
              <LinearGradient
                colors={["#9b3f9a", "#d0689f"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ paddingHorizontal: 40, paddingVertical: 13 }}
              >
                <Text className="text-[16px] font-bold uppercase text-white">
                  Create account
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => router.push("/login")}>
              <Text className="text-center text-[13px] text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Text className="font-bold text-[#a8449a]">Login</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}





// import {
//   View,
//   Text,
//   TextInput,
//   ImageBackground,
//   Pressable,
//   ScrollView,
//   Platform,
//   KeyboardAvoidingView,
//   useWindowDimensions,
// } from "react-native";

// import { useSignUp } from "@clerk/expo";
// import { router } from "expo-router";
// import { useToast } from "../Contexts/ToastContext";

// // Form handling
// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// // ZOD VALIDATION

// const signupSchema = z.object({
//   email: z
//     .string()
//     .trim()
//     .min(1, "Email is required")
//     .email("Please enter a valid email"),

//   password: z
//     .string()
//     .min(1, "Password is required")
//     .min(15, "Password must be at least 15 characters"),
// });

// export default function Signup() {
//   const { signUp } = useSignUp();

//   const { showToast } = useToast();

//   const { width, height } = useWindowDimensions();

//   // REACT HOOK FORM

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(signupSchema),

//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   // SIGNUP

//   const handleSignup = async (data) => {
//     console.log("SIGNUP BUTTON PRESSED");

//     try {
//       // CLERK SIGNUP

//       const { error } = await signUp.password({
//         emailAddress: data.email,
//         password: data.password,
//       });

//       if (error) {
//         console.log("Signup error:", error);

//         showToast(error.message, "error");

//         return;
//       }

//       console.log("Signup successful");

//       // SEND EMAIL VERIFICATION

//       const { error: verificationError } =
//         await signUp.verifications.sendEmailCode();

//       if (verificationError) {
//         console.log("Verification error:", verificationError);

//         showToast(verificationError.message, "error");

//         return;
//       }

//       console.log("Verification code sent");

//       // GO TO VERIFY SCREEN

//       router.push("/verify");
//     } catch (err) {
//       console.log("Signup exception:", err);

//       showToast("Something went wrong", "error");
//     }
//   };

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
//         >
//           <ImageBackground
//             source={require("../assets/Cart.png")}
//             resizeMode="cover"
//             style={{
//               width: width,
//               height: height * 0.36,
//             }}
//           />

//           {/* RIGHT SIDE */}

//           <View className="-mt-[30px] flex-1 rounded-t-[30px] bg-white px-[20px] pb-[30px] pt-[25px] dark:bg-[#292929]">
//             {/* Sign Up */}

//             <Text className="mb-[20px] text-[28px] font-bold text-black dark:text-white">
//               Sign up 👋
//             </Text>

//             {/* Email */}

//             <Text className="mb-[8px] text-[16px] text-black dark:text-white">
//               Email
//             </Text>

//             <Controller
//               control={control}
//               name="email"
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <TextInput
//                   placeholder="janedoe@email.com"
//                   placeholderTextColor="#999"
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   autoCapitalize="none"
//                   keyboardType="email-address"
//                   className="mb-[14px] rounded-[25px] border border-gray-200 bg-white px-[18px] py-[12px] text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
//                 />
//               )}
//             />

//             {/* Email Error */}

//             {errors.email && (
//               <Text className="mb-[10px] text-red-500">
//                 {errors.email.message}
//               </Text>
//             )}

//             {/* Password */}

//             <Text className="mb-[8px] text-[16px] text-black dark:text-white">
//               Password
//             </Text>

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
//                   className="mb-[22px] rounded-[25px] border border-gray-200 bg-white px-[18px] py-[12px] text-black dark:border-gray-700 dark:bg-[#292929] dark:text-white"
//                 />
//               )}
//             />

//             {/* Password Error */}

//             {errors.password && (
//               <Text className="mb-[10px] text-red-500">
//                 {errors.password.message}
//               </Text>
//             )}

//             {/* Create Account */}

//             <Pressable
//               onPress={handleSubmit(handleSignup)}
//               className="mb-[20px] items-center rounded-[25px] bg-[#0f8a73] py-[14px]"
//             >
//               <Text className="text-[16px] font-bold text-white">
//                 Create account
//               </Text>
//             </Pressable>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// import { useState } from "react";
// import { View, Text, TextInput, Button } from "react-native";
// import { useSignUp } from "@clerk/expo";
// import { router } from "expo-router";
// import { useToast } from "../Contexts/ToastContext";

// export default function Signup() {
//   const { signUp } = useSignUp();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const { showToast } = useToast();

//   const handleSignup = async () => {
//     if (!email || !password) {
//       showToast("Please enter email and password", "error");
//       return;
//     }

//     if (password.length < 15) {
//       showToast("Password must be at least 15 characters", "password Error");
//       return;
//     }

//     try {
//       const { error } = await signUp.password({
//         emailAddress: email,
//         password: password,
//       });

//       if (error) {
//         console.log("Signup error:", error);
//         showToast("error.message", "signup.error");
//         return;
//       }

//       console.log("Signup successful");

//       // Send verification code
//       const { error: verificationError } =
//         await signUp.verifications.sendEmailCode();

//       if (verificationError) {
//         console.log("Verification error:", verificationError);
//         showToast("verificationError.message", "error");
//         return;
//       }

//       console.log("Verification code sent");

//       // Go to separate verify screen
//       router.push("/verify");
//     } catch (err) {
//       console.log("Signup exception:", err);
//       showToast("Something went wrong", "Error");
//     }
//   };

//   return (
//     <View className="flex-1 justify-center px-[20px]">
//       {/* Title */}
//       <Text className="mb-[20px] text-[28px] font-bold">Sign Up</Text>

//       {/* Email */}
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         className="mb-[15px] rounded-[8px] border border-[#ccc] p-[12px]"
//       />

//       {/* Password */}
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         className="mb-[15px] rounded-[8px] border border-[#ccc] p-[12px]"
//       />

//       {/* Sign Up Button */}
//       <Button title="Sign Up" onPress={handleSignup} />
//     </View>
//   );
// }