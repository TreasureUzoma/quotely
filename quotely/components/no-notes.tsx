import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

export const NoNotes = () => {
  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/images/no-notes.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subText}>Create your first note!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  subText: {
    fontSize: 18,
    marginTop: -8,
    color: "#1C2121",
    fontFamily: Platform.select({
      ios: "Geist_400Regular",
      android: "Geist_400Regular",
    }),
  },
});
