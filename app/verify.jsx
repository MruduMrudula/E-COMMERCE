import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useSignUp } from "@clerk/expo";
import { router } from "expo-router";
import { useToast } from "../Contexts/ToastContext";

export default function Verify() {
  const { signUp } = useSignUp();

  const [code, setCode] = useState("");

  const { showToast } = useToast();
const [loading, setLoading] = useState(false);
  const handleVerify = async () => {
    if (!code) {
      showToast("Error", "Please enter verification code");
      return;
    }
    if (loading) return;

    setLoading(true);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: code,
      });

      if (error) {
        console.log("Verify error:", error);
        showToast("Verification Error", error.message);
        return;
      }

      console.log("Email verified");
console.log("SIGNUP STATUS AFTER VERIFY:", signUp.status);
console.log(
  "MISSING REQUIREMENTS:",
  JSON.stringify(signUp.missingFields, null, 2),
);
      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize();

        if (finalizeError) {
          console.log("Finalize error:", finalizeError);
          showToast(finalizeError.message, "error");
          return;
        }

        console.log("Signup completed");

        router.replace("/");
      }
    } catch (err) {
      console.log("Verify exception:", err);
      showToast("Something went wrong", "error");
    } finally {
    setLoading(false);
  }
  };

  return (
    <View className="flex-1 justify-center px-[20px]">
      {/* Title */}
      <Text className="mb-[15px] text-[28px] font-bold">Verify Email</Text>

      {/* Description */}
      <Text className="mb-[20px]">
        Enter the verification code sent to your email.
      </Text>

      {/* Verification Code */}
      <TextInput
        placeholder="Enter verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        className="mb-[15px] rounded-[8px] border border-[#ccc] p-[12px]"
      />

      {/* Verify Button */}
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
}






// Its otp verification code using nativewind
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,

//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { useToast } from "../Contexts/ToastContext";
// import { useState } from "react";
// import { useSignIn } from "@clerk/expo";
// import { useRouter } from "expo-router";

// export default function OTP() {
//   const { signIn, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [otp, setOtp] = useState("");
// const { showToast } = useToast();
//   const handleVerify = async () => {
//     if (!isLoaded) return;

//     if (otp.length !== 6) {
//       showToast( "Please enter the 6-digit OTP","error");
//       return;
//     }

//     try {
//       const result = await signIn.attemptFirstFactor({
//         strategy: "phone_code",
//         code: otp,
//       });

//       if (result.status === "complete") {
//         router.replace("/(tabs)");
//       }
//     } catch (error) {
//       console.log(error);

//       showToast("Please check the OTP and try again.", "error");
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       className="flex-1 bg-white"
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <View className="flex-1 p-[25px]">
//         <Text className="mt-[100px] text-center text-[24px] font-bold">
//           Enter OTP
//         </Text>

//         <Text className="mt-[10px] text-center text-[14px] text-gray-500">
//           Enter the 6-digit code sent to your phone
//         </Text>

//         <TextInput
//           className="mt-[50px] rounded-xl border border-gray-300 p-[18px] text-center text-[24px] tracking-[10px]"
//           keyboardType="number-pad"
//           value={otp}
//           onChangeText={setOtp}
//           maxLength={6}
//           placeholder="••••••"
//           placeholderTextColor="#ccc"
//           autoFocus={true}
//         />

//         <TouchableOpacity
//           className="mt-[50px] items-center rounded-full bg-red-500 p-[18px]"
//           onPress={handleVerify}
//         >
//           <Text className="text-[18px] font-bold text-white">Verify OTP</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
