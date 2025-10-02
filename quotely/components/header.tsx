import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";

interface HeaderProps {
  title: string;
  elements?: React.ReactNode;
}

export const Header = ({ title, elements }: HeaderProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {elements && <View style={styles.elements}>{elements}</View>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: Platform.select({
      android: "Geist_700Bold",
      ios: "Geist_700Bold",
    }),
    flexShrink: 1,
  },
  elements: {
    flexDirection: "row",
    alignItems: "center",
  },
});
