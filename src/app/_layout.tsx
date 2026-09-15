import { Tabs } from "expo-router";
import { Text } from "react-native";

import { useDatabase } from "@/hooks/useDatabase";

const COLORS = {
  active: "#1e40af",
  inactive: "#94a3b8",
};

export default function RootLayout() {
  useDatabase();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Histórico",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
        }}
      />
    </Tabs>
  );
}
