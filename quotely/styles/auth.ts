import { Platform, StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  top: {
    marginTop: 40,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 32,
    textAlign: "center",
    fontFamily: Platform.select({
      android: "Geist_700Bold",
      ios: "Geist_700Bold",
    }),
    marginBottom: 15,
  },
  subText: {
    fontSize: 17,
    textAlign: "center",
    fontFamily: Platform.select({
      android: "Geist_400Regular",
      ios: "Geist_400Regular",
    }),
    color: "#555",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
  },
});
