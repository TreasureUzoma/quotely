import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { CustomButton } from "../components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { authStyles as styles } from "../styles/auth";
import { apiUrl } from "../constants";
import { setTokens } from "../lib/auth/token-storage";

export const AuthPage = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const listener = Linking.addEventListener("url", (event) => {
      const url = event.url;

      if (url.startsWith("myapp://auth")) {
        const params = Linking.parse(url).queryParams;
        const accessToken = params?.accessToken;
        const refreshToken = params?.refreshToken;

        if (accessToken && refreshToken) {
          setTokens(accessToken as string, refreshToken as string);
          navigation.replace("Main");
        }
      }
    });

    return () => listener.remove();
  }, []);

  const handleGoogleLogin = async () => {
    const url = `${apiUrl}/auth/google`;
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={styles.root}>
      <Text style={{ opacity: 0 }}>.</Text>

      <View>
        <Text style={styles.heading}>Welcome to Quotely</Text>
        <Text style={styles.subText}>
          Sign in below to use Quotely. We'll create your account if you don't
          have one.
        </Text>
      </View>

      <View>
        <CustomButton
          title="Continue with Google"
          iconLeft={<Ionicons name="logo-google" size={20} color="white" />}
          onPress={handleGoogleLogin}
        />
      </View>
    </View>
  );
};
