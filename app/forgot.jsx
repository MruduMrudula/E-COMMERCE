import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useSignIn } from "@clerk/expo";
import { router } from "expo-router";
import { useToast } from "../Contexts/ToastContext";

export default function ForgotPassword() {
  const { signIn } = useSignIn();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const { showToast } = useToast();

  // Send reset code
  const handleSendCode = async () => {
    if (!email) {
      showToast("Please enter your email", "Error");
      return;
    }

    try {
      const { error: createError } = await signIn.create({
        identifier: email,
      });

      if (createError) {
        console.log("Create error:", createError);
        showToast(createError.message, "error");
        return;
      }

      const { error: sendCodeError } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendCodeError) {
        console.log("Send code error:", sendCodeError);
        showToast(sendCodeError.message, "error");
        return;
      }

      console.log("Password reset code sent");

      setCodeSent(true);

      showToast(
        "Code Sent",
        "Password reset code has been sent to your email.",
      );
    } catch (error) {
      console.log("Forgot password error:", error);
      showToast("Error", "Something went wrong");
    }
  };

  // Verify code
  const handleVerifyCode = async () => {
    if (!code) {
      showToast("Please enter verification code", "Error");
      return;
    }

    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({
        code,
      });

      if (error) {
        console.log("Verify code error:", error);
        showToast(error.message, "Verification Error");
        return;
      }

      console.log("Reset code verified");

      setCodeVerified(true);
    } catch (error) {
      console.log("Verify error:", error);
      showToast("Something went wrong", "error");
    }
  };

  // Set new password
  const handleResetPassword = async () => {
    if (!newPassword) {
      showToast("Please enter a new password", "error");
      return;
    }

    if (newPassword.length < 15) {
      showToast("Password must be at least 15 characters", "Password Error");
      return;
    }

    try {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password: newPassword,
      });

      if (error) {
        console.log("Reset password error:", error);
        showToast(error.message, "Error");
        return;
      }

      console.log("Password reset successful");

      if (signIn.status === "complete") {
        await signIn.finalize();

        router.replace("/");
      }
    } catch (error) {
      console.log("Reset password exception:", error);
      showToast("Something went wrong", "Error");
    }
  };

  return (
    <View className="flex-1 justify-center px-[20px]">
      {/* Title */}
      <Text className="mb-[30px] text-center text-[28px] font-bold">
        Forgot Password
      </Text>

      {/* Step 1: Email */}
      {!codeSent && (
        <>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="mb-[15px] rounded-[8px] border border-[#ccc] p-[12px]"
          />

          <Button title="Send Code" onPress={handleSendCode} />
        </>
      )}

      {/* Step 2: Verification Code */}
      {codeSent && !codeVerified && (
        <>
          <Text className="mb-[20px]">
            Enter the verification code sent to your email.
          </Text>

          <TextInput
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            className="mb-[15px] rounded-[8px] border border-[#ccc] p-[12px]"
          />

          <Button title="Verify Code" onPress={handleVerifyCode} />
        </>
      )}

      {/* Step 3: New Password */}
      {codeVerified && (
        <>
          <TextInput
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            className="mb-[15px] rounded-[8px] border border-[#ccc] p-[12px]"
          />

          <Button title="Reset Password" onPress={handleResetPassword} />
        </>
      )}

      {/* Back to Login */}
      <Text
        className="mt-[20px] text-center text-blue-500"
        onPress={() => router.replace("/login")}
      >
        Back to Login
      </Text>
    </View>
  );
}
