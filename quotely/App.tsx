import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainTabs } from "./components/bottom-nav";

import { AuthPage } from "./pages/auth";
import { OnboardingPage } from "./pages/onboarding";

import { useSession } from "./hooks/use-session-query";

import {
  useFonts,
  Geist_400Regular,
  Geist_700Bold,
} from "@expo-google-fonts/geist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ Geist_400Regular, Geist_700Bold });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const { isAuthenticated, isLoading: isAuthChecking } = useSession();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    async function checkAppStatus() {
      const onboarded =
        (await AsyncStorage.getItem("hasSeenOnboarding")) == "true";
      setHasOnboarded(onboarded);

      if (!isAuthChecking) {
        setIsAppLoading(false);
      }
    }
    checkAppStatus();
  }, [isAuthChecking]);

  let initialRouteName = "Onboarding";
  if (hasOnboarded) {
    initialRouteName = isAuthenticated ? "Main" : "Auth";
  }

  if (isAppLoading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingPage} />
        <Stack.Screen name="Auth" component={AuthPage} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
