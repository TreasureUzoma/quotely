import { StyleSheet, Text, View } from "react-native";

export const HomePage = () => {
  return (
    <View style={styles.root}>
      <Text>Hello Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
