import { Text, View } from "react-native";

export const AppLogo = () => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text
      style={{
        fontSize: 28,
        fontWeight: "bold",
        color: "#007AFF",
        fontFamily: "Geist_700Bold",
      }}
    >
      Quotely
    </Text>
  </View>
);
