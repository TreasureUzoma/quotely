import { Dimensions, StyleSheet } from "react-native";

export const { width, height } = Dimensions.get("window");

export const onboardingStyles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#F9F9F9",
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.7,
    height: height * 0.35,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: "Geist_700Bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Geist_400Regular",
    color: "#1C2121",
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007AFF",
    width: 20,
  },
});
