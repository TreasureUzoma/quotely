import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { CustomButton } from "../components/ui/button";
import { useNotes } from "../hooks/use-notes";
import { useNavigation } from "@react-navigation/native";

const COLORS = [
  "#FD99FF",
  "#FF9E9E",
  "#91F48F",
  "#FFF599",
  "#9EFFFF",
  "#B69CFF",
];

export const NewNotePage = () => {
  const [content, setContent] = useState("");
  const { create } = useNotes();
  const navigation = useNavigation<any>();

  const handleCreateNote = () => {
    if (!content.trim()) {
      Toast.show({
        type: "error",
        text1: "Cannot create empty note",
        position: "bottom",
      });
      return;
    }

    const payload = {
      content,
      bgColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    create.mutate(payload, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Note created successfully!",
          position: "bottom",
        });
        setContent("");
        navigation.goBack();
      },
      onError: () => {
        Toast.show({
          type: "error",
          text1: "Failed to create note",
          position: "bottom",
        });
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.container}>
        <TextInput
          placeholder="Type your note (max 150 chars)"
          value={content}
          onChangeText={(text) => {
            if (text.length <= 160) setContent(text);
          }}
          multiline
          style={styles.textArea}
        />

        <CustomButton
          title={create.isPending ? "Creating..." : "Create Note"}
          onPress={handleCreateNote}
          style={styles.button}
          disabled={create.isPending}
        />
      </View>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textArea: {
    width: "100%",
    height: 200,
    backgroundColor: "#ededed",
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    textAlignVertical: "top",
    fontFamily: Platform.select({
      ios: "Geist_400Regular",
      android: "Geist_400Regular",
    }),
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: Platform.select({
      ios: "Geist_700Bold",
      android: "Geist_700Bold",
    }),
  },
});
