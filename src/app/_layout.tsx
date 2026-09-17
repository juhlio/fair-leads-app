import { Tabs } from "expo-router";
import { Text } from "react-native";

import { HistoryProvider } from "@/hooks/useHistory";

const COLORS = {
  active: "#F5730C",
  inactive: "#94a3b8",
};

export default function RootLayout() {
  return (
    <HistoryProvider>
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
    </HistoryProvider>
  );
}
