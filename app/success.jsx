import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function Success() {
  return (
    <View className="flex-1 items-center justify-center rounded-t-[30px] bg-white px-[30px]">
      {/* Success Icon */}
      <View className="mb-[20px] h-[80px] w-[80px] items-center justify-center rounded-full bg-green-200">
        <Text className="text-[45px] text-green-700">✓</Text>
      </View>

      {/* Title */}
      <Text className="mb-[8px] text-[28px] font-bold">Successful</Text>

      {/* Description */}
      <Text className="mb-[30px] text-center text-[14px] text-gray-500">
        Your new account has been successfully created.
      </Text>

      {/* Done Button */}
      <Pressable
        onPress={() => router.replace("/")}
        className="w-full rounded-[8px] bg-[#292929] py-[14px]"
      >
        <Text className="text-center text-[16px] font-medium text-white">
          Done
        </Text>
      </Pressable>
    </View>
  );
}
