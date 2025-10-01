import { Platform, StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Platform.select({
      ios: "Geist_400Regular",
      android: "Geist_400Regular",
    }),
  },
});
