

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
const ContactUsModal = ({ visible}) => {
  const handleCall = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:care@cartora.club");
  };

  const handleStartChat = () => {
    console.log("Start Chat Pressed");
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => router.back()}
    >
      {/* Background Overlay */}
      <TouchableWithoutFeedback  onPress={() => router.back()}>
        <View className="flex-1 bg-black/50 justify-end">
          {/* Bottom Form Sheet Container */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-white rounded-t-3xl p-6 mb-10 shadow-lg">
              {/* Top Drag Indicator Line */}
              <View className="items-center mb-5">
                <View className="w-12 h-1 bg-gray-300 rounded-full" />
              </View>

              {/* Modal Title */}
              <Text className="text-xl font-bold text-black mb-5">
                Contact us
              </Text>

              {/* Main Card Wrapper */}
              <View className="border border-gray-200 rounded-2xl p-4 mb-6">
                {/* 1. Call Us Row */}
                <TouchableOpacity
                  onPress={handleCall}
                  activeOpacity={0.7}
                  className="flex-row justify-between items-center py-3 border-b border-gray-100"
                >
                  <Text className="text-base font-medium text-gray-800">
                    Call us
                  </Text>
                  <Ionicons name="call" size={20} color="#0066FF" />
                </TouchableOpacity>

                {/* 2. Mail Us Row */}
                <TouchableOpacity
                  onPress={handleEmail}
                  activeOpacity={0.7}
                  className="flex-row justify-between items-center py-3 border-b border-gray-100"
                >
                  <Text className="text-base font-medium text-gray-800">
                    Mail us
                  </Text>
                  <Text className="text-base font-semibold text-blue-600">
                    care@Cartora.club
                  </Text>
                </TouchableOpacity>

                {/* 3. Chat With Us Row */}
                <TouchableOpacity
                  onPress={handleStartChat}
                  activeOpacity={0.7}
                  className="flex-row justify-between items-center py-3 mb-3"
                >
                  <Text className="text-base font-medium text-gray-800">
                    Chat with us
                  </Text>
                  <Text className="text-base font-semibold text-gray-600">
                    Start chat
                  </Text>
                </TouchableOpacity>

                {/* Note Banner Inside Card */}
                <View className="bg-gray-100 rounded-xl p-3 mt-1">
                  <Text className="text-xs text-gray-500 leading-4">
                    Please note: Our support team is available on all days of
                    the week, from 8:00 AM to 12:30 AM.
                  </Text>
                </View>
              </View>

              {/* "Got it" Button */}
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.8}
                className="bg-neutral-900 py-4 rounded-full items-center mb-2"
              >
                <Text className="text-white text-base font-semibold">
                  Got it
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ContactUsModal;




