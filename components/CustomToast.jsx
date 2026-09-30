import { View, Text, StyleSheet } from "react-native";

export default function CustomToast({ message, type = "success" }) {
  return (
    <View style={[styles.toast, styles[type]]}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    zIndex: 999,
  },

  success: {
    backgroundColor: "green",
  },

  error: {
    backgroundColor: "red",
  },

  message: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
