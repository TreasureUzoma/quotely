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
import Toast from "react-native-toast-message";
import { useGoogleAuth } from "../hooks/use-auth";
import { AppLogo } from "../components/app-logo";

export const AuthPage = () => {
  const navigation = useNavigation<any>();
  const { mutate } = useGoogleAuth();

  useEffect(() => {
    const listener = Linking.addEventListener("url", (event) => {
      const url = event.url;
      console.log(url);

      if (url.startsWith("quotely://auth")) {
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
    const redirectUrl = Linking.createURL("auth");
    const url = `${apiUrl}/auth/google?redirect_uri=${encodeURIComponent(
      redirectUrl
    )}`;

    console.log(url);
    console.log(redirectUrl);

    const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);
    console.log(result);

    if (result.type === "success" && result.url.startsWith(redirectUrl)) {
      const params = Linking.parse(result.url).queryParams;
      const accessToken = params?.accessToken as string | undefined;
      const refreshToken = params?.refreshToken as string | undefined;

      if (accessToken && refreshToken) {
        mutate(
          { accessToken, refreshToken },
          {
            onSuccess: () => {
              Toast.show({
                type: "success",
                text1: "Signed in successfully",
                position: "bottom",
                visibilityTime: 4000,
              });
              navigation.replace("Main");
            },
          }
        );
      }
    }
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
