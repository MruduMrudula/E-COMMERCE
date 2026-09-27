import {
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";

import { useSignIn } from "@clerk/expo/legacy";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";

import { useToast } from "../Contexts/ToastContext";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


// ZOD VALIDATION SCHEMA


const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});

export default function Login() {
 
  // CLERK
  

  const { signIn, isLoaded } = useSignIn();

  const { isSignedIn, userId } = useAuth();

  const router = useRouter();

  const { showToast } = useToast();

 
  // REACT HOOK FORM
 
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

  
  // LOGIN FUNCTION
  

  const handleLogin = async (data) => {
    console.log("LOGIN BUTTON PRESSED");

    // Clerk loading check
    if (!isLoaded) {
      console.log("CLERK IS NOT LOADED");

      showToast("Please wait, authentication is loading", "error");

      return;
    }

    console.log("CLERK IS LOADED");

    console.log("SIGNED IN:", isSignedIn);

    console.log("USER ID:", userId);

    // Already signed in
    if (isSignedIn) {
      console.log("USER ALREADY SIGNED IN");

      router.replace("/(tabs)/home");

      return;
    }

    try {
      console.log("STARTING CLERK LOGIN...");

      console.log("EMAIL:", data.email);

      
      // CLERK LOGIN
      

      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      console.log("CLERK RESULT:", result);

      console.log("LOGIN STATUS:", result.status);

      
      // LOGIN SUCCESS
      

      if (result.status === "complete") {
        console.log("LOGIN SUCCESSFUL");

        router.replace("/(tabs)/home");

        return;
      }

      
      // LOGIN NOT COMPLETE
     

      console.log("LOGIN NOT COMPLETE:", result.status);

      showToast(`Login is not complete: ${result.status}`, "error");
    } catch (error) {
      console.log("CLERK LOGIN ERROR:", error);

      // Clerk error message
      const message =
        error?.errors?.[0]?.message || error?.message || "Login failed";

      showToast(message, "error");
    }
  };

 
  // UI
 

  return (
    <ImageBackground
      source={require("../assets/caller.png")}
      className="flex-1"
      resizeMode="contain"
    >
      <View className="flex-1 justify-center bg-white/10 px-[20px]">
        {/* LOGIN TITLE */}

        <Text className="mb-[25px] text-[32px] font-bold text-black">
          Login
        </Text>

        {/* EMAIL */}

        <Text className="mb-[8px] text-[18px] text-black">Email</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="janedoe@email.com"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              className="mb-[18px] rounded-[25px] border border-black/40 bg-white/40 px-[18px] py-[12px] text-black"
            />
          )}
        />

        {/* EMAIL ERROR */}

        {errors.email && (
          <Text className="mb-[10px] text-red-500">{errors.email.message}</Text>
        )}

        {/* PASSWORD */}

        <Text className="mb-[8px] text-[18px] text-black">Password</Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              className="mb-[22px] rounded-[25px] border border-black/40 bg-white/40 px-[18px] py-[12px] text-black"
            />
          )}
        />

        {/* PASSWORD ERROR */}

        {errors.password && (
          <Text className="mb-[10px] text-red-500">
            {errors.password.message}
          </Text>
        )}

        {/* LOGIN BUTTON */}

        <Pressable
          onPress={handleSubmit(handleLogin)}
          className="mb-[20px] items-center rounded-[25px] bg-white py-[20px]"
        >
          <Text className="text-[16px] font-bold text-[#356b68]">Login</Text>
        </Pressable>

        {/* FORGOT PASSWORD */}

        <Pressable onPress={() => router.push("/forgot")}>
          <Text className="mt-[15px] text-right text-blue-500">
            Forgot Password?
          </Text>
        </Pressable>

        {/* SIGN UP */}

        <Pressable onPress={() => router.push("/signUp")}>
          <Text className="mt-[20px] text-center text-blue-500">
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}




























//**  Using NATIVEWIND  Phone number  Singup Code***//
// import { useSignUp } from "@clerk/expo";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import { useToast } from "../Contexts/ToastContext";
// import {

//   Image,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import callerImage from "../assets/caller.png";

// export default function SignUp() {
//   const { signUp } = useSignUp();
//   const router = useRouter();
// const { showToast } = useToast();
//   const [phoneNumber, setPhoneNumber] = useState("");
// const [showNumber, setShowNumber] = useState(false);
//  const handleContinue = async () => {
//    if (phoneNumber.length !== 10) {
//      showToast("Please enter a valid 10-digit phone number","error");
//      return;
//    }

//    try {
//      const fullPhoneNumber = `+91${phoneNumber}`;
//      console.log("PHONE:", fullPhoneNumber);

//      const error = await signUp.create({
//        phoneNumber: fullPhoneNumber,
//      });

//       console.log("SIGN UP RESULT:", error);

//   await signUp.verifications.sendPhoneCode();

//       console.log("OTP SENT");
//     //  router.push("/otp");
//     router.replace("/(tabs)/home")
//    } catch (error) {
//   console.log("CLERK ERROR:", error);

//   showToast(
//     error?.message || "Something went wrong",
//     "error"
//   );
// }
// }
//   return (
//     <View className="flex-1 bg-white p-[25px]">
//       {/* Image */}
//       <View>
//         <Image
//           source={callerImage}
//           className="mt-[200px] mb-10"
//           style={{ width: 90, height: 90, marginLeft: 150 }}
//         />
//       </View>

//       {/* Title */}
//       <Text className="mb-[10px] text-center text-[20px] font-bold mt-100px">
//         Enter your phone number
//       </Text>

//       {/* Subtitle */}
//       <Text className="mb-[40px] text-center text-[13px] text-[#888]">
//         We'll be sending you a verification OTP here
//       </Text>

//       {/* Phone Number */}
//       <View className="flex-row mx-[80px] ">
//         <Text className="mr-[10px] text-[27px] ">
//           <Ionicons name="add" size={18} color="black" />
//           91
//         </Text>
//         <View className="flex-1 flex-row items-center">
//           {showNumber ? (
//             <Text className="text-[18px] text-black">{phoneNumber}</Text>
//           ) : (
//             Array.from({ length: 10 }).map((_, index) => (
//               <Text
//                 key={index}
//                 className={`mr-[4px] text-[22px] ${
//                   index < phoneNumber.length
//                     ? "text-black"
//                     : index === phoneNumber.length
//                       ? "text-red-500"
//                       : "text-[#ccc]"
//                 }`}
//               >
//                 •
//               </Text>
//             ))
//           )}

//           <TextInput
//             className="absolute inset-0 opacity-0"
//             keyboardType="phone-pad"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             maxLength={10}
//             // autoFocus={true}
//           />

//           <TouchableOpacity
//             className="ml-auto"
//             onPress={() => setShowNumber(!showNumber)}
//           >
//             <Ionicons
//               name={showNumber ? "eye-off-outline" : "eye-outline"}
//               size={22}
//               color="black"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//       {/* Continue Button */}
//       <KeyboardAvoidingView className="flex-1 bg-white" behavior="height">
//         <View className="flex-1 p-[25px]">
//           {/* your content */}

//           <TouchableOpacity
//             className="mt-[30px] items-center rounded-full bg-[#ccc] p-[18px]"
//             onPress={handleContinue}
//           >
//             <Text className="text-[18px] font-bold text-white">Continue</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }
//***  Normal code signUp code usinG REACT NATIVE + JAVASCRIPT STYLE SHEET***//

// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   Alert,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { useState } from "react";
// import { useSignIn } from "@clerk/expo";
// import { useRouter } from "expo-router";

// export default function Login() {
//   const { signIn } = useSignIn();
//   const router = useRouter();

//   const [phoneNumber, setPhoneNumber] = useState("");

//   const handleContinue = async () => {
//     if (phoneNumber.length !== 10) {
//       Alert.alert("Error", "Please enter a valid 10-digit phone number");
//       return;
//     }
//     try {
//       const fullPhoneNumber = "+91" + phoneNumber;

//       await signIn.create({
//         identifier: fullPhoneNumber,
//       });

//       await signIn.prepareFirstFactor({
//         strategy: "phone_code",
//       });

//       router.push("/otp");
//     } catch (error) {
//       console.log(error);
//       Alert.alert(
//         "Error",
//         "Unable to send OTP. Please check your phone number.",
//       );
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <View>
//         <Image source={require("../assets/caller.png")} style={styles.image} />
//       </View>
//       <Text style={styles.title}>Enter your phone number</Text>
//       <Text style={styles.subtitle}>
//         We'll be sending you a verification OTP here
//       </Text>
//       <View style={styles.phoneContainer}>
//         <Text style={styles.countryCode}>+91</Text>
//         <TextInput
//           className="flex-1  p-0 text-xl text-black"
//           style={styles.input}
//           placeholder="••••••••••"
//           placeholderTextColor="#8a94a6"
//           keyboardType="phone-pad"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//           maxLength={10}
//           secureTextEntry={true}
//         />
//       </View>
//       <TouchableOpacity className="bg-red-500 p-5" onPress={handleContinue}>
//         <Text className="text-white text-xl">Continue</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 25,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 13,
//     color: "#888",
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   image: {
//     width: 95,
//     height: 95,
//     marginLeft: 300,
//     marginTop: 70,
//   },
//   phoneContainer: {
//     flexDirection: "row",
//     alignItems: "center",

//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     paddingBottom: 10,
//   },
//   countryCode: {
//     fontSize: 20,
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 20,
//     borderWidth: 0,
//     backgroundColor: "transparent",
//     padding: 0,
//     outlineStyle: "none",
//   },
//   // button: {
//   //   backgroundColor: "#ccc",
//   //   padding: 18,
//   //   borderRadius: 30,
//   //   marginTop: 50,
//   //   alignItems: "center",
//   // },
//   // buttonText: {
//   //   color: "#fff",
//   //   fontSize: 18,
//   //   fontWeight: "bold",
//   // },
// });

// import { View, Text } from "react-native";

// export default function Index() {
//   return (
//     <View className="flex-1 items-center justify-center bg-blue-500">
//       <Text className="text-3xl font-bold text-white">NativeWind Works</Text>
//     </View>
//   );
// }
