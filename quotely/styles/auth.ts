import { Platform, StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    gap: 30,
  },
  heading: {
    fontSize: 32,
    textAlign: "center",
    fontFamily: Platform.select({
      android: "Geist_700Bold",
      ios: "Geist_700Bold",
    }),
    marginBottom: 15,
    letterSpacing: -1.2,
  },
  subText: {
    fontSize: 17,
    textAlign: "center",
    fontFamily: Platform.select({
      android: "Geist_400Regular",
      ios: "Geist_400Regular",
    }),
    color: "#1C2121",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
  },
});
