import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainTabs } from "./components/bottom-nav";

import { AuthPage } from "./pages/auth";
import { OnboardingPage } from "./pages/onboarding";

import {
  useFonts,
  Geist_400Regular,
  Geist_700Bold,
} from "@expo-google-fonts/geist";

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ Geist_400Regular, Geist_700Bold });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Onboarding"
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
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
