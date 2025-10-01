import React from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CustomButton } from "../components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { authStyles as styles } from "../styles/auth";

export const AuthPage = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <Text style={styles.heading}>Welcome to Quotely</Text>
        <Text style={styles.subText}>
          Sign in below to use Quotely. We'll create your account if you don't
          have one.
        </Text>
      </View>

      <View style={styles.center}>
        <Ionicons name="document-text-outline" size={120} color="#4F46E5" />
      </View>

      <View style={styles.bottom}>
        <CustomButton
          title="Continue with Google"
          iconLeft={<Ionicons name="logo-google" size={20} color="white" />}
          onPress={() => navigation.navigate("Home")}
          style={styles.button}
        />
      </View>
    </View>
  );
};
