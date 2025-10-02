import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Alert, TouchableOpacity } from "react-native";

import { HomePage } from "../pages/home";
import { NewNotePage } from "../pages/new-note";
import { setTokens } from "../lib/auth/token-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  const navigation = useNavigation<any>();
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Logout",
        style: "destructive",

        onPress: async () => {
          await setTokens(null, null);
          Toast.show({
            type: "success",
            text1: "Signed out successfully",
            position: "bottom",
            visibilityTime: 4000,
          });
          navigation.replace("Auth");
        },
      },
    ]);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Notes"
        component={HomePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="New"
        component={NewNotePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={HomePage}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={handleLogout}
              style={props.style}
              accessibilityRole={props.accessibilityRole}
              accessibilityState={props.accessibilityState}
              accessibilityLabel={props.accessibilityLabel}
              testID={props.testID}
            >
              {props.children}
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
