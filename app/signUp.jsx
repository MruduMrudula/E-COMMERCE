import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useSignUp } from "@clerk/expo";
import { router } from "expo-router";
import { useToast } from "../Contexts/ToastContext";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#292929", "#4A4A4A"]}
        style={{
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 5,
        }}
      >
        <ImageBackground
          source={require("../assets/caller.png")}
          className="flex-1"
          resizeMode="contain"
        >
          {/* RIGHT SIDE */}

          <View className="w-full h-full mt-[-100] justify-center  px-[30px]">
            {/* Sign Up */}

            <Text className="mb-[25px] justify-center[32px] font-bold text-white text-[24px]">
              Sign up 👋
            </Text>

            {/* Email */}

            <Text className="mb-[8px] text-[18px] text-white">Email</Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="janedoe@email.com"
                  placeholderTextColor="#eeeeee"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="mb-[18px] rounded-[25px] border border-black/40 bg-white/10 px-[18px] py-[12px] text-black"
                />
              )}
            />

            {/* Email Error */}

            {errors.email && (
              <Text className="mb-[10px] text-red-500">
                {errors.email.message}
              </Text>
            )}

            {/* Password */}

            <Text className="mb-[8px] text-[18px] text-white">Password</Text>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#eeeeee"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  className="mb-[22px] rounded-[25px] border border-black/40 bg-white/10 px-[18px] py-[12px] text-black"
                />
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
              className="mb-[20px] items-center rounded-[25px] bg-pink-500 py-[14px]"
            >
              <Text className="text-[20px] font-bold text-[#356b68]">
                Create account
              </Text>
            </Pressable>
          </View>
        </ImageBackground>
      </LinearGradient>
    </SafeAreaView>
  );
}








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
